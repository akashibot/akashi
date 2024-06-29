use image::{ImageError, ImageFormat};
use poise::serenity_prelude;

use crate::utils::discord::image::{load_dynamic_buffer, operate_image};
use crate::{Context, Error};

/// Blur an image
///
/// `blur 7`
/// 
/// ⚠️ This command is experimental and may not work as expected.
/// Current status: working as intended.
#[poise::command(prefix_command, track_edits, slash_command, category = "Image", broadcast_typing)]
pub async fn blur(
    ctx: Context<'_>,
    #[description = "Measure of how much to blur by (between 1 and 100)"]
    #[max = 100]
    #[min = 1]
    value: usize,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    ctx.defer_or_broadcast().await?;

    let image = load_dynamic_buffer(ctx, url, attachment).await.map_err(|_| Err::<ImageError, &str>("Error loading image")).unwrap();

    match value {
        1..=100 => {
            operate_image(ctx, image.blur(value as f32), Some(ImageFormat::Png)).await?;
        },
        _ => return Err("Value must be between 0.3 and 500".into()),
    }

    Ok(())
}