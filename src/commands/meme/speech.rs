use std::collections::HashMap;

use poise::serenity_prelude;

use crate::utils::discord::image::{get_image_url, load_meme};
use crate::{Context, Error};

/// Make a speech balloon of an image
///
/// `speech`
#[poise::command(prefix_command, track_edits, slash_command, category = "Meme")]
pub async fn speech(
    ctx: Context<'_>,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    let image = get_image_url(ctx, url, attachment).await.unwrap();

    ctx.defer_or_broadcast().await?;

    let mut body = HashMap::new();

    body.insert("image".into(), image);

    load_meme(ctx, "/meme/speech".to_owned(), body).await?;

    Ok(())
}
