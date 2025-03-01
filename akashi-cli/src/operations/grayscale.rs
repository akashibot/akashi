use crate::{
	cli::{ImageOperation, commands::GrayscaleCommand},
	util::{
		gif::{decode_gif, save_gif},
		media::MediaType,
		video::invoke_ffmpeg_command,
	},
};
use anyhow::{Result, anyhow};
use image::{Frame, Rgba, RgbaImage};
use rayon::prelude::*;
use std::path::PathBuf;

impl ImageOperation for GrayscaleCommand {
	async fn run(&self, input: &PathBuf, output: &PathBuf) {
		grayscale_image(input.clone(), output.clone())
			.await
			.expect("Failed to process grayscale");
	}
}

pub(crate) async fn grayscale_image(input: PathBuf, output: PathBuf) -> Result<()> {
	match MediaType::from_path(input.clone()) {
		MediaType::Static => grayscale_static(input, output).await,
		MediaType::Gif => grayscale_gif(input, output).await,
		MediaType::Video => grayscale_video(input, output).await,
		MediaType::Unknown => Err(anyhow!("Unsupported or unknown media type")),
	}
}

async fn grayscale_static(input: PathBuf, output: PathBuf) -> Result<()> {
	let img = image::open(input)?;

	grayscale_with_alpha(&img.to_rgba8()).save(output)?;

	Ok(())
}

async fn grayscale_gif(input: PathBuf, output: PathBuf) -> Result<()> {
	let grayscale_frames: Vec<Frame> = decode_gif(&input)
		.await?
		.par_iter()
		.map(|frame| {
			let buffer = frame.clone().into_buffer();
			let grayscale_buffer = grayscale_with_alpha(&buffer);

			Frame::new(grayscale_buffer)
		})
		.collect();

	save_gif(grayscale_frames, output, None)?;

	Ok(())
}

async fn grayscale_video(input: PathBuf, output: PathBuf) -> Result<()> {
	invoke_ffmpeg_command()
		.arg("-i")
		.arg(&input)
		.arg("-vf")
		.arg("format=gray")
		.arg(&output)
		.status()
		.await?;

	Ok(())
}

fn grayscale_with_alpha(image: &RgbaImage) -> RgbaImage {
	let mut grayscale_image = image.clone();

	for pixel in grayscale_image.pixels_mut() {
		let Rgba([r, g, b, a]) = *pixel;
		let gray = ((0.299 * r as f32) + (0.587 * g as f32) + (0.114 * b as f32)) as u8;

		*pixel = Rgba([gray, gray, gray, a]);
	}

	grayscale_image
}
