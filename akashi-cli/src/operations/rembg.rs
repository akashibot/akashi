use crate::cli::ImageOperation;
use crate::cli::commands::RembgCommand;
use crate::util::color::most_abundant_color;
use crate::util::gif::{decode_gif, save_gif};
use crate::util::media::MediaType;
use anyhow::{Result, anyhow};
use image::{DynamicImage, Frame, GenericImageView, Pixel, Rgba, RgbaImage};
use rayon::prelude::*;
use std::path::PathBuf;

impl ImageOperation for RembgCommand {
	async fn run(&self, input: &PathBuf, output: &PathBuf) {
		rembg_image(input.clone(), output.clone())
			.await
			.expect("Failed to process rembg");
	}
}

pub(crate) async fn rembg_image(input: PathBuf, output: PathBuf) -> Result<()> {
	match MediaType::from_path(input.clone()) {
		MediaType::Static => rembg_static(input, output).await,
		MediaType::Gif => rembg_gif(input, output).await,
		MediaType::Video => rembg_video().await,
		MediaType::Unknown => Err(anyhow!("Unsupported or unknown media type")),
	}
}

async fn rembg_static(input: PathBuf, output: PathBuf) -> Result<()> {
	let mut img = image::open(input)?;
	let abundant_color = match most_abundant_color(&img, 100) {
		Some(color) => color,
		None => return Err(anyhow!("Invalid (or non existing) color")),
	};

	for pixel in img.to_rgba8().pixels_mut() {
		let rgb = pixel.to_rgb();
		if rgb == abundant_color {
			*pixel = Rgba([0, 0, 0, 0]);
		}
	}

	img.save(output)?;

	Ok(())
}

async fn rembg_gif(input: PathBuf, output: PathBuf) -> Result<()> {
	let frames: Vec<Frame> = decode_gif(&input)
		.await?
		.par_iter()
		.map(|frame| {
			let mut buffer: RgbaImage = frame.clone().into_buffer();
			let abundant_color =
				most_abundant_color(&DynamicImage::from(buffer.clone()), 100).unwrap();

			for pixel in buffer.pixels_mut() {
				let rgb = pixel.to_rgb();
				if rgb == abundant_color {
					*pixel = Rgba([0, 0, 0, 0]);
				}
			}

			Frame::new(buffer)
		})
		.collect();

	save_gif(frames, output, None)?;

	Ok(())
}

async fn rembg_video() -> Result<()> {
	Err(anyhow!(
		"Rembg operation is not available for videos at the moment"
	))
}
