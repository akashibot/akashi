use poise::{serenity_prelude, ChoiceParameter};

use crate::utils::discord::image::{get_image_url, load_image};
use crate::{Context, Error};

fn parse_size(size_str: &str) -> Result<(u32, u32), String> {
    let parts: Vec<&str> = size_str.split('x').collect();
    let width = parts
        .first()
        .ok_or_else(|| "Invalid format".to_owned())?
        .parse::<u32>()
        .map_err(|_| "Invalid width".to_owned())?;
    let height = parts
        .get(1)
        .map_or(Ok(width), |h| h.parse::<u32>().map_err(|_| "Invalid height".to_owned()))
        .unwrap_or(width);

    Ok((width, height))
}

#[derive(Debug, poise::ChoiceParameter)]
pub enum ResizeTypeChoices {
    #[name = "embed"]
    Embed,
    #[name = "enlarge"]
    Enlarge,
}

/// Resize an image
///
/// `resize 200x200`
/// `resize 200` ("height" will be the same as "width now")
#[poise::command(prefix_command, track_edits, slash_command, category = "Image", broadcast_typing)]
pub async fn resize(
    ctx: Context<'_>,
    #[description = "New image size (E.g: 200x200 or 200)"] size: String,
    #[description = "Resize type (default: enlarge)"]
    #[rename = "type"]
    resize_type: Option<ResizeTypeChoices>,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    let (width, height) = parse_size(&size)?;

    let image = get_image_url(ctx, url, attachment).await.unwrap();

    load_image(
        ctx,
        image,
        format!("{},s_{width}x{height}", resize_type.unwrap_or(ResizeTypeChoices::Enlarge).name()),
        None,
    )
    .await?;

    Ok(())
}

#[cfg(test)]
mod resize_tests {
    use super::*;

    #[test]
    fn test_parse_size() {
        assert_eq!(parse_size("200x200").unwrap(), (200, 200));
        assert_eq!(parse_size("100x100").unwrap(), (100, 100));
        assert_eq!(parse_size("200").unwrap(), (200, 200));
        assert!(parse_size("200").is_ok());
        assert!(parse_size("200x").is_ok());
        assert_eq!(parse_size("200x").unwrap(), (200, 200));
        assert!(parse_size("x200").is_err());
        assert!(parse_size("").is_err());
    }
}
