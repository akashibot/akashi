use crate::{utils::load_image, Context, Error};

fn parse_size(size_str: &str) -> Result<(u32, u32), String> {
    let parts: Vec<&str> = size_str.split('x').collect();
    if parts.len() != 2 {
        return Err("Invalid format".into());
    }
    let width = parts[0].parse::<u32>().map_err(|_| "Invalid width".to_owned())?;
    let height = parts[1].parse::<u32>().map_err(|_| "Invalid height".to_owned())?;

    Ok((width, height))
}

/// Resize an image
/// 
/// `resize 200x200`
#[poise::command(prefix_command, track_edits, slash_command, category = "image")]
pub async fn resize(
    ctx: Context<'_>,
    #[description = "New image size"] size: String,
    #[description = "Url of the image"] url: Option<String>
) -> Result<(), Error> {
    let (width, height) = parse_size(&size)?;

    load_image(ctx, url, format!("s_{}x{}", width, height)).await?;

    Ok(())
}