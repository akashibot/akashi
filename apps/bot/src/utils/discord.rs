use crate::{Context, Error};
use poise::{
    serenity_prelude::{model::colour, Attachment, CreateAttachment, CreateEmbed},
    CreateReply, ReplyHandle,
};
use reqwest::{Error as RError, Response};
use std::collections::{hash_map::Entry, HashMap};

use super::filetype::{get_sig, Type};

pub async fn get_response_bytes(res: Response) -> Result<Vec<u8>, Error> {
    Ok(res.bytes().await?.to_vec())
}

pub async fn fetch_image(url: String) -> Result<Vec<u8>, RError> {
    let response = reqwest::get(url).await?;

    Ok(get_response_bytes(response).await.unwrap())
}

pub async fn send_image_embed(
    ctx: Context<'_>,
    file: CreateAttachment,
) -> Result<ReplyHandle, Error> {
    ctx.send(
        CreateReply::default().attachment(file.clone()).embed(
            CreateEmbed::default()
                .title("Result")
                .color(colour::colours::branding::GREEN)
                .attachment(file.filename),
        ),
    )
    .await
    .map_err(Into::into)
}

pub async fn load_image(
    ctx: Context<'_>,
    url: String,
    operation: String,
) -> Result<ReplyHandle, Error> {
    let image_url: String = match url {
        url if !url.is_empty() => format!("{}/{}/{}", ctx.data().ipx_host, operation, url),
        _ => return Err("URL is required and must not be empty".into()),
    };

    let buffer: Vec<u8> = fetch_image(image_url).await?;
    let ext = get_sig(&buffer).unwrap_or(Type::Png).as_str();
    let file: CreateAttachment =
        CreateAttachment::bytes(buffer.as_slice(), format!("{}.{ext}", ctx.command().name));

    send_image_embed(ctx, file).await
}

pub async fn load_meme(
    ctx: Context<'_>,
    endpoint: String,
    body: HashMap<String, String>,
) -> Result<ReplyHandle, Error> {
    let response: Response = ctx
        .data()
        .reqwest_client
        .post(format!("{}{}", ctx.data().illumi_host, endpoint))
        .json(&body)
        .send()
        .await?;
    let bytes: Vec<u8> = get_response_bytes(response).await.unwrap();

    let ext = get_sig(&bytes).unwrap_or(Type::Png).as_str();
    let file: CreateAttachment =
        CreateAttachment::bytes(bytes.as_slice(), format!("{}.{ext}", ctx.command().name));

    send_image_embed(ctx, file).await
}

pub async fn get_image_url(
    ctx: Context<'_>,
    url: Option<String>,
    attachment: Option<Attachment>,
) -> Result<String, Error> {
    match (url, attachment) {
        (Some(url), _) => Ok(url),
        (None, Some(attachment)) => Ok(attachment.proxy_url),
        (None, None) => {
            let mut images = ctx.data().cached_images.lock().await;
            let entry = images.entry(ctx.channel_id());

            match entry {
                Entry::Occupied(entry) => Ok(entry.get().to_owned()),
                _ => Ok(format!("{}?format=png", ctx.author().face())),
            }
        }
    }
}