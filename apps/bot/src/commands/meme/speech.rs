use std::collections::HashMap;

use poise::serenity_prelude;

use crate::{utils::discord::{get_image_url, load_meme}, Context, Error};

/// Make a speech balloon of an image
///
/// `speech`
#[poise::command(prefix_command, track_edits, slash_command, category = "meme")]
pub async fn speech(
    ctx: Context<'_>,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    let image = get_image_url(ctx, url, attachment).await.unwrap_or(ctx.author().face());

    let mut body = HashMap::new();

    body.insert("image".into(), image);

    load_meme(ctx, "/meme/speech-balloon".to_owned(), body).await?;

    Ok(())
}
