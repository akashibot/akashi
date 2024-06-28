use poise::serenity_prelude;

use crate::utils::discord::image::{get_image_url, load_image};
use crate::{Context, Error};

/// Blur an image
///
/// `blur 7`
#[poise::command(prefix_command, track_edits, slash_command, category = "Image", broadcast_typing)]
pub async fn blur(
    ctx: Context<'_>,
    #[description = "The sigma of the Gaussian mask (between 0.3 and 500)"]
    #[max = 100_u32]
    #[min = 1_u32]
    value: u32,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    let image = get_image_url(ctx, url, attachment).await.unwrap();

    match value {
        1..=100 => {
            load_image(ctx, image, format!("blur_{value}"), None).await?;
        },
        _ => return Err("Value must be between 0.3 and 500".into()),
    }

    Ok(())
}
