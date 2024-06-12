use crate::{utils::load_image, Context, Error};

/// Invert an image colors (or alpha if specified.)
/// 
/// `invert alpha`
#[poise::command(prefix_command, track_edits, slash_command, category = "image")]
pub async fn invert(
    ctx: Context<'_>,
    #[description = "Should invert alpha channel"] #[flag] alpha: bool,
    #[description = "Url of the image"] url: Option<String>
) -> Result<(), Error> {

    load_image(ctx, url, format!("negate_{:?}", alpha)).await?;

    Ok(())
}