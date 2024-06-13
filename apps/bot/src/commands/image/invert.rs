use poise::serenity_prelude;

use crate::{
    utils::discord::{get_image_url, load_image},
    Context, Error,
};

/// Invert an image colors (or alpha if specified.)
///
/// `invert alpha`
#[poise::command(
    prefix_command,
    track_edits,
    slash_command,
    category = "image",
    broadcast_typing
)]
pub async fn invert(
    ctx: Context<'_>,
    #[description = "Should invert alpha channel"]
    #[flag]
    alpha: bool,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    let image = get_image_url(ctx, url, attachment)
        .await
        .unwrap_or(ctx.author().face());

    load_image(ctx, image, format!("negate_{alpha:?}")).await?;

    Ok(())
}
