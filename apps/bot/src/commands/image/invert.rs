use crate::{utils::load_image, Context, Error};

/// Invert an image colors (or alpha if specified.)
/// 
/// `invert <image_url> --alpha=true`
#[poise::command(prefix_command, track_edits, slash_command, category = "image")]
pub async fn invert(
    ctx: Context<'_>,
    #[description = "Url of the image"] url: Option<String>,
    #[description = "Should invert alpha channel"]
    #[rest]
    alpha: Option<bool>
) -> Result<(), Error> {

    load_image(ctx, url, format!("negate_{:?}", alpha.or(Some(false)))).await?;

    Ok(())
}