use poise::serenity_prelude;

use crate::utils::discord::image::{get_image_url, load_image};
use crate::{Context, Error};

/// Grayscale an image
///
/// `grayscale`
#[poise::command(prefix_command, track_edits, slash_command, category = "Image", broadcast_typing)]
pub async fn grayscale(
    ctx: Context<'_>,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    let image = get_image_url(ctx, url, attachment).await.unwrap();

    load_image(ctx, image, "grayscale".to_string(), None).await?;

    Ok(())
}
