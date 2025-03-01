use crate::{
	cli::{ImageOperation, commands::InvertCommand},
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

impl ImageOperation for InvertCommand {
	async fn run(&self, input: &PathBuf, output: &PathBuf) {
		invert_image(input.clone(), output.clone())
			.await
			.expect("Failed to process invert");
	}
}

pub(crate) async fn invert_image(input: PathBuf, output: PathBuf) -> Result<()> {
	match MediaType::from_path(input.clone()) {
		MediaType::Static => invert_static(input, output).await,
		MediaType::Gif => invert_gif(input, output).await,
		MediaType::Video => invert_video(input, output).await,
		MediaType::Unknown => Err(anyhow!("Unsupported or unknown media type")),
	}
}

async fn invert_static(input: PathBuf, output: PathBuf) -> Result<()> {
	let mut img = image::open(input)?;

	img.invert();
	img.save(output)?;

	Ok(())
}

async fn invert_gif(input: PathBuf, output: PathBuf) -> Result<()> {
	let inverted_frames: Vec<Frame> = decode_gif(&input)
		.await?
		.par_iter()
		.map(|frame| {
			let mut buffer: RgbaImage = frame.clone().into_buffer();

			for pixel in buffer.pixels_mut() {
				let Rgba([r, g, b, a]) = *pixel;
				*pixel = Rgba([255 - r, 255 - g, 255 - b, a]);
			}

			Frame::new(buffer)
		})
		.collect();

	save_gif(inverted_frames, output, None)?;

	Ok(())
}

async fn invert_video(input: PathBuf, output: PathBuf) -> Result<()> {
	invoke_ffmpeg_command()
		.arg("-i")
		.arg(&input)
		.arg("-vf")
		.arg("negate")
		.arg(&output)
		.status()
		.await?;

	Ok(())
}
