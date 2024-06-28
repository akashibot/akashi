use poise::serenity_prelude;

use crate::utils::discord::{get_image_url, load_image};
use crate::utils::filetype::Type;
use crate::{Context, Error};

/// Change an image mimetype
///
/// `to png`
#[poise::command(prefix_command, track_edits, slash_command, category = "image", broadcast_typing)]
pub async fn to(
    ctx: Context<'_>,
    #[description = "Image mimetype target"] mime: Type,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    let image = get_image_url(ctx, url, attachment).await.unwrap();

    load_image(ctx, image, format!("f_{:?}", mime), Type::from_str(mime.as_str())).await?;

    Ok(())
}
