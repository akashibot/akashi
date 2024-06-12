use poise::serenity_prelude;

use crate::{utils::load_image, Context, Error};

/// Invert an image colors (or alpha if specified.)
/// 
/// `invert alpha`
#[poise::command(prefix_command, track_edits, slash_command, category = "image")]
pub async fn invert(
    ctx: Context<'_>,
    #[description = "Should invert alpha channel"] #[flag] alpha: bool,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>
) -> Result<(), Error> {
    let image: String = match (url, attachment) {
        (Some(url), _) => url,
        (None, Some(attachment)) => attachment.proxy_url,
        _ => return Err("No image url or attachment provided".into()),
    };

    load_image(ctx, image, format!("negate_{:?}", alpha)).await?;

    Ok(())
}