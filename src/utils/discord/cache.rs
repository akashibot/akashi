use crate::Context;

pub async fn fallback_cached_image(ctx: Context<'_>) -> Result<String, String> {
    let mut cached_images = ctx.data().cached_images.lock().await;
    let entry = cached_images.get(&ctx.channel_id());

    match entry {
        Some(image) => Ok(image.to_string()),
        None => Ok(format!("{}?format=png", ctx.author().face())),
    }
}
