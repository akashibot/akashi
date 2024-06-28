use std::collections::HashMap;

use poise::serenity_prelude::CreateAttachment;
use poise::{CreateReply, ReplyHandle};
use reqwest::Response;
use serenity::all::{Attachment, CreateEmbed, CreateEmbedFooter};
use serenity::model::colour;

use super::cache::fallback_cached_image;
use crate::utils::filetype::{get_sig, Type};
use crate::{Context, Error};

pub async fn get_response_bytes(res: Response) -> Result<Vec<u8>, Error> {
    Ok(res.bytes().await?.to_vec())
}

pub async fn fetch_image(url: String) -> Result<Vec<u8>, Error> {
    let response = reqwest::get(url).await?;

    if !response.status().is_success() {
        return Err("An error has occurred while processing your image".into());
    }

    Ok(get_response_bytes(response).await.unwrap())
}

pub async fn send_image_embed(
    ctx: Context<'_>,
    file: CreateAttachment,
    time: Option<u128>,
) -> Result<ReplyHandle, Error> {
    let time = match time {
        Some(time) => format!("Took {time:?}ms to complete"),
        None => "".to_string(),
    };

    ctx.send(
        CreateReply::default().attachment(file.clone()).embed(
            CreateEmbed::default()
                .color(colour::colours::roles::DEFAULT)
                .attachment(file.filename)
                .footer(CreateEmbedFooter::new(time)),
        ),
    )
    .await
    .map_err(Into::into)
}

pub async fn load_image(
    ctx: Context<'_>,
    url: String,
    operation: String,
    ext: Option<Type>,
) -> Result<ReplyHandle, Error> {
    // calculate time taken to load image
    let start = std::time::Instant::now();
    let image_url: String = match url {
        url if !url.is_empty() => format!("{}/ipx/{}/{}", ctx.data().api_url, operation, url),
        _ => return Err("URL is required and must not be empty".into()),
    };

    let buffer: Vec<u8> = fetch_image(image_url).await?;
    let ext = ext.unwrap_or(get_sig(&buffer).unwrap_or(Type::Png)).as_str();
    let file: CreateAttachment =
        CreateAttachment::bytes(buffer.as_slice(), format!("{}.{ext}", ctx.command().name));
    let time = start.elapsed().as_millis();

    send_image_embed(ctx, file, Some(time)).await
}

pub async fn load_meme(
    ctx: Context<'_>,
    endpoint: String,
    body: HashMap<String, String>,
) -> Result<ReplyHandle, Error> {
    let response: Response = ctx
        .data()
        .reqwest_client
        .post(format!("{}{}", ctx.data().api_url, endpoint))
        .json(&body)
        .send()
        .await?;

    let bytes: Vec<u8> = get_response_bytes(response).await.unwrap();

    let ext = get_sig(&bytes).unwrap_or(Type::Png).as_str();
    let file: CreateAttachment =
        CreateAttachment::bytes(bytes.as_slice(), format!("{}.{ext}", ctx.command().name));

    send_image_embed(ctx, file, None).await
}

pub async fn get_image_url(
    ctx: Context<'_>,
    url: Option<String>,
    attachment: Option<Attachment>,
) -> Result<String, String> {
    let referenced_message = match ctx {
        poise::Context::Prefix(ctx) => ctx.msg.referenced_message.as_ref(),
        poise::Context::Application(_) => None,
    };

    match (url, attachment, referenced_message) {
        (Some(url), _, _) => Ok(url),
        (None, Some(attachment), _) => Ok(attachment.proxy_url.clone()),
        (None, None, Some(referenced_message)) => {
            if !referenced_message.attachments.is_empty() {
                Ok(referenced_message.attachments.first().unwrap().proxy_url.clone())
            } else if !referenced_message.embeds.is_empty() {
                Ok(referenced_message
                    .embeds
                    .first()
                    .unwrap()
                    .image
                    .clone()
                    .unwrap()
                    .proxy_url
                    .unwrap())
            } else {
                fallback_cached_image(ctx).await
            }
        },
        (None, None, None) => fallback_cached_image(ctx).await,
    }
}
