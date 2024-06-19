use poise::serenity_prelude;

use crate::{
    utils::discord::{get_image_url, load_image},
    Context, Error,
};

fn parse_size(size_str: &str) -> Result<(u32, u32), String> {
    let parts: Vec<&str> = size_str.split('x').collect();
    if parts.len() != 2 {
        return Err("Invalid format".into());
    }
    let width = parts[0]
        .parse::<u32>()
        .map_err(|_| "Invalid width".to_owned())?;
    let height = parts[1]
        .parse::<u32>()
        .map_err(|_| "Invalid height".to_owned())?;

    Ok((width, height))
}

/// Resize an image
///
/// `resize 200x200`
#[poise::command(
    prefix_command,
    track_edits,
    slash_command,
    category = "image",
    broadcast_typing
)]
pub async fn resize(
    ctx: Context<'_>,
    #[description = "New image size (E.g: 200x200)"] size: String,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    let (width, height) = parse_size(&size)?;
    
    let image = get_image_url(ctx, url, attachment)
        .await
        .unwrap();

    load_image(ctx, image, format!("enlarge,s_{width}x{height}"), None).await?;

    Ok(())
}

#[test]
fn test_parse_size() {
    assert_eq!(parse_size("200x200").unwrap(), (200, 200));
    assert_eq!(parse_size("100x100").unwrap(), (100, 100));
    assert!(parse_size("200").is_err());
    assert!(parse_size("200x").is_err());
    assert!(parse_size("x200").is_err());
}