use poise::serenity_prelude;

use crate::utils::discord::image::{get_image_url, load_image};
use crate::{Context, Error};

/// Set an image quality
///
/// `quality 0`
#[poise::command(prefix_command, track_edits, slash_command, category = "Image", broadcast_typing)]
pub async fn quality(
    ctx: Context<'_>,
    #[description = "New image quality (Between 0 and 100)"]
    #[max = 100_u8]
    #[min = 0_u8]
    quality: u8,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    let image = get_image_url(ctx, url, attachment).await.unwrap();

    match quality {
        0..=100 => {
            load_image(ctx, image, format!("quality_{quality}"), None).await?;
        },
        _ => return Err("Quality must be between 0 and 100".into()),
    }

    Ok(())
}
