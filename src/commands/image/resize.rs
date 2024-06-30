use image::{imageops, ImageError, ImageFormat};
use poise::serenity_prelude;

use crate::utils::discord::image::{load_dynamic_buffer, operate_image};
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

/// Resize an image
///
/// `resize 200x200 <image>`
/// `resize 200 <image>` ("height" will be the same as "width now")
#[poise::command(prefix_command, track_edits, slash_command, category = "Image", broadcast_typing)]
pub async fn resize(
    ctx: Context<'_>,
    #[description = "New image size (E.g: 200x200 or 200)"] size: String,
    #[description = "Resize type"] resize_type: Option<ResizeType>,
    #[description = "Image url"] url: Option<String>,
    #[description = "Image attachment"] attachment: Option<serenity_prelude::Attachment>,
) -> Result<(), Error> {
    let (width, height) = parse_size(&size)?;

    ctx.defer_or_broadcast().await?;

    let image = load_dynamic_buffer(ctx, url, attachment)
        .await
        .map_err(|_| Err::<ImageError, &str>("Error loading image"))
        .unwrap();

    operate_image(
        ctx,
        image.resize(width, height, resize_type.unwrap_or(ResizeType::Nearest).to_valid_type()),
        Some(ImageFormat::Png),
    )
    .await?;

    Ok(())
}

#[derive(Debug, PartialEq, poise::ChoiceParameter)]
pub enum ResizeType {
    Nearest,
    Triangle,
    CatmullRom,
    Gaussian,
    Lanczos3,
}

impl ResizeType {
    pub fn to_valid_type(&self) -> imageops::FilterType {
        match self {
            ResizeType::Nearest => imageops::FilterType::Nearest,
            ResizeType::Triangle => imageops::FilterType::Triangle,
            ResizeType::CatmullRom => imageops::FilterType::CatmullRom,
            ResizeType::Gaussian => imageops::FilterType::Gaussian,
            ResizeType::Lanczos3 => imageops::FilterType::Lanczos3,
        }
    }
}
