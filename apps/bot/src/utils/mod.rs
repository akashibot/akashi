use crate::{Context, Error};
use poise::{serenity_prelude::CreateAttachment, CreateReply, ReplyHandle};
use reqwest::Error as RError;
use std::time::Instant;

pub async fn fetch_image(url: String) -> Result<Vec<u8>, RError> {
    let response = reqwest::get(url).await?;
    let bytes = response.bytes().await?;

    Ok(bytes.to_vec())
}

pub async fn load_image(
    ctx: Context<'_>,
    url: String,
    operation: String,
) -> Result<ReplyHandle, Error> {
    let start = Instant::now();
    let image_url = match url {
        url if !url.is_empty() => format!("{}/{}/{}", ctx.data().ipx_host, operation, url),
        _ => return Err("URL is required and must not be empty".into()),
    };

    let buffer = fetch_image(image_url).await?;
    let file = CreateAttachment::bytes(buffer.as_slice(), format!("{}.png", ctx.command().name));
    let duration = start.elapsed();

    ctx.send(
        CreateReply::default()
            .content(format!("Done in {}ms", duration.as_millis()))
            .attachment(file),
    )
    .await
    .map_err(Into::into)
}
