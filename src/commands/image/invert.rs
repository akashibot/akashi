use poise::serenity_prelude;

use crate::utils::discord::image::{get_image_url, load_image};
use crate::{Context, Error};

/// Invert an image alpha
///
/// `invert`
#[poise::command(prefix_command, track_edits, slash_command, category = "Image", broadcast_typing)]
pub async fn invert(
    ctx: Context<'_>,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    let image = get_image_url(ctx, url, attachment).await.unwrap();

    load_image(ctx, image, "negate".to_owned(), None).await?;

    Ok(())
}
