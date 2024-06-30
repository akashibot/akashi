use std::collections::HashMap;
use std::io::Cursor;

use image::{DynamicImage, ImageError, ImageFormat};
use poise::serenity_prelude::CreateAttachment;
use poise::{CreateReply, ReplyHandle};
use reqwest::Response;
use serenity::all::{Attachment, CreateEmbed, CreateEmbedFooter};
use serenity::model::colour;

use super::cache::fallback_cached_image;
use super::rand::generate_random_text;
use crate::utils::filetype::{get_sig, Type};
use crate::{Context, Error};

pub async fn get_response_bytes(res: Response) -> Result<Vec<u8>, Error> {
    Ok(res.bytes().await?.to_vec())
}

pub async fn fetch_image(ctx: Context<'_>, url: String) -> Result<Vec<u8>, Error> {
    let response = ctx.data().reqwest_client.get(url).send().await;

    match response {
        Ok(res) => Ok(get_response_bytes(res).await.unwrap()),
        Err(_) => Err("An error has occurred while processing your image".into()),
    }
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
                .color(colour::colours::branding::GREEN)
                .attachment(file.filename)
                .footer(CreateEmbedFooter::new(time)),
        ),
    )
    .await
    .map_err(Into::into)
}

pub async fn load_meme(
    ctx: Context<'_>,
    endpoint: String,
    body: HashMap<String, String>,
) -> Result<ReplyHandle, Error> {
    let response: Response = ctx
        .data()
        .reqwest_client
        .post(format!("{}/meme{}", ctx.data().api_url, endpoint))
        .json(&body)
        .send()
        .await?;

    let bytes: Vec<u8> = get_response_bytes(response).await.unwrap();

    let ext = get_sig(&bytes).unwrap_or(Type::Png).as_str();
    let file: CreateAttachment =
        CreateAttachment::bytes(bytes.as_slice(), format!("{}.{ext}", generate_random_text(5)));

    send_image_embed(ctx, file, None).await
}

pub async fn load_dynamic_buffer(
    ctx: Context<'_>,
    url: Option<String>,
    attachment: Option<Attachment>,
) -> Result<DynamicImage, ImageError> {
    let image_url = get_image_url(ctx, url, attachment).await.unwrap();
    let image_buffer = fetch_image(ctx, image_url).await.unwrap();

    load_image(image::load_from_memory(image_buffer.as_slice())).await
}

pub async fn load_image(
    image: Result<DynamicImage, ImageError>,
) -> Result<DynamicImage, ImageError> {
    match image {
        Ok(img) => Ok(img),
        Err(err) => Err(err),
    }
}

pub async fn operate_image(
    ctx: Context<'_>,
    image: DynamicImage,
    format: Option<ImageFormat>,
) -> Result<ReplyHandle, Error> {
    let start = std::time::Instant::now();
    let mut bytes = Vec::new();

    image.write_to(&mut Cursor::new(&mut bytes), format.unwrap_or(ImageFormat::Png)).unwrap();

    let ext = get_sig(bytes.as_slice()).unwrap_or(Type::Png).as_str();
    let file: CreateAttachment =
        CreateAttachment::bytes(bytes, format!("{}.{ext}", generate_random_text(5)));

    let time = start.elapsed().as_millis();
    send_image_embed(ctx, file, Some(time)).await
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
            if let Some(image) = referenced_message.attachments.first() {
                Ok(image.proxy_url.clone())
            } else if let Some(embed) = referenced_message.embeds.first() {
                if let Some(image) = &embed.image {
                    if let Some(proxy_url) = &image.proxy_url {
                        Ok(proxy_url.clone())
                    } else {
                        fallback_cached_image(ctx).await
                    }
                } else {
                    fallback_cached_image(ctx).await
                }
            } else {
                fallback_cached_image(ctx).await
            }
        },
        (None, None, None) => fallback_cached_image(ctx).await,
    }
}
