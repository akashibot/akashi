use std::collections::HashMap;

use poise::serenity_prelude;

use crate::{
    utils::discord::{get_image_url, load_meme},
    Context, Error,
};

/// Caption an image
///
/// `caption me when ehwheedsdasda`
#[poise::command(prefix_command, track_edits, slash_command, category = "meme")]
pub async fn caption(
    ctx: Context<'_>,
    #[description = "Caption text"] caption: String,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    let image = get_image_url(ctx, url, attachment)
        .await
        .unwrap_or(ctx.author().face());

    ctx.defer_or_broadcast().await?;

    let mut body = HashMap::new();

    body.insert("image".into(), image);
    body.insert("caption".into(), caption);

    load_meme(ctx, "/meme/caption".to_owned(), body).await?;

    Ok(())
}
