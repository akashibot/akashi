use poise::serenity_prelude;

use crate::{utils::load_image, Context, Error};

/// Set an image quality
///
/// `quality 0`
#[poise::command(prefix_command, track_edits, slash_command, category = "image")]
pub async fn quality(
    ctx: Context<'_>,
    #[description = "New image quality (Between 0 and 100)"] quality: u8,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    let image: String = match (url, attachment) {
        (Some(url), _) => url,
        (None, Some(attachment)) => attachment.proxy_url,
        _ => return Err("No image url or attachment provided".into()),
    };

    match quality {
        0..=100 => {
            load_image(ctx, image, format!("quality_{quality}")).await?;
        }
        _ => return Err("Quality must be between 0 and 100".into()),
    }

    Ok(())
}
