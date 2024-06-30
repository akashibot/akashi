use image::{ImageError, ImageFormat};
use poise::serenity_prelude;

use crate::utils::discord::image::{load_dynamic_buffer, operate_image};
use crate::{Context, Error};

/// Invert an image
///
/// `,invert`
/// `/invert`
#[poise::command(prefix_command, track_edits, slash_command, category = "Image", broadcast_typing)]
pub async fn invert(
    ctx: Context<'_>,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    ctx.defer_or_broadcast().await?;

    let image = load_dynamic_buffer(ctx, url, attachment)
        .await
        .map_err(|_| Err::<ImageError, &str>("Error loading image"))
        .unwrap();
    let mut inplaced_image = image.clone();

    inplaced_image.invert();

    operate_image(ctx, inplaced_image, Some(ImageFormat::Png)).await?;

    Ok(())
}
