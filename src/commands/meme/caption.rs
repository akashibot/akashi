use std::collections::HashMap;

use poise::serenity_prelude;

use crate::utils::discord::image::{get_image_url, load_meme};
use crate::{Context, Error};

/// Caption an image
///
/// `caption "me when ehwheedsdasda"` — *Quotes are needed if you want multi-line caption*
#[poise::command(prefix_command, track_edits, slash_command, category = "Meme")]
pub async fn caption(
    ctx: Context<'_>,
    #[description = "Caption text"] caption: String,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    let image = get_image_url(ctx, url, attachment).await.unwrap();

    ctx.defer_or_broadcast().await?;

    let mut body = HashMap::new();

    body.insert("image".into(), image);
    body.insert("caption".into(), caption);

    load_meme(ctx, "/caption".to_owned(), body).await?;

    Ok(())
}
