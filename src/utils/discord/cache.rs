use serenity::all::ChannelId;

use crate::{Context, Data, Error};

pub async fn fallback_cached_image(ctx: Context<'_>) -> Result<String, String> {
    let mut cached_images = ctx.data().cached_images.lock().await;
    let entry = cached_images.get(&ctx.channel_id());

    match entry {
        Some(image) => Ok(image.to_string()),
        None => Ok(format!("{}?format=png", ctx.author().face())),
    }
}

pub async fn save_image_to_cache(
    data: &Data,
    channel_id: ChannelId,
    image: String,
) -> Result<(), Error> {
    let mut cached_images = data.cached_images.lock().await;

    cached_images.put(channel_id, image);

    Ok(())
}
