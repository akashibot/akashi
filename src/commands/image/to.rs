use image::ImageError;
use poise::serenity_prelude;

use crate::utils::discord::image::{load_dynamic_buffer, operate_image};
use crate::utils::filetype::Type;
use crate::{Context, Error};

/// Change an image mimetype
///
/// `to png`
#[poise::command(prefix_command, track_edits, slash_command, category = "Image", broadcast_typing)]
pub async fn to(
    ctx: Context<'_>,
    #[description = "Image mimetype target"] mime: Type,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    ctx.defer_or_broadcast().await?;

    let image = load_dynamic_buffer(ctx, url, attachment).await.map_err(|_| Err::<ImageError, &str>("Error loading image")).unwrap();

    operate_image(ctx, image, Some(mime.to_valid_imageformat())).await?;

    Ok(())
}
