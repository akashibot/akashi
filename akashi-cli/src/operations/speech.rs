use crate::{
	cli::{ImageOperation, commands::SpeechCommand},
	util::{
		gif::{decode_gif, save_gif},
		images::expand_image_top,
		media::MediaType,
		video::{get_video_resolution, invoke_ffmpeg_command},
	},
};
use anyhow::{Result, anyhow};
use image::{
	DynamicImage, Frame, RgbaImage,
	imageops::{FilterType, overlay},
};
use rayon::prelude::*;
use std::path::{Path, PathBuf};

const SPEECH_BALLOON_PATH: &str =
	r#"C:\Users\rsark\OneDrive\Documentos\Projects\akashi\bot\akashi-cli\assets\speech0.png"#;

impl ImageOperation for SpeechCommand {
	async fn run(&self, input: &PathBuf, output: &PathBuf) {
		speech_image(input.clone(), output.clone())
			.await
			.expect("Failed to process speech");
	}
}

pub(crate) async fn speech_image(input: PathBuf, output: PathBuf) -> Result<()> {
	match MediaType::from_path(input.clone()) {
		MediaType::Static => speech_static(input, output).await,
		MediaType::Gif => speech_gif(input, output).await,
		MediaType::Video => speech_video(input, output).await,
		MediaType::Unknown => Err(anyhow!("Unsupported or unknown media type")),
	}
}

async fn speech_static(input: PathBuf, output: PathBuf) -> Result<()> {
	let img = image::open(input)?;
	let balloon = load_and_resize_balloon(SPEECH_BALLOON_PATH, img.width())?;
	let mut expanded_img = expand_image_top(&img, balloon.height());

	overlay(&mut expanded_img, &balloon, 0, 0);

	expanded_img.save(output)?;

	Ok(())
}

async fn speech_gif(input: PathBuf, output: PathBuf) -> Result<()> {
	let img = image::open(&input)?;
	let balloon = load_and_resize_balloon(SPEECH_BALLOON_PATH, img.width())?;
	let frames: Vec<Frame> = decode_gif(&input)
		.await?
		.par_iter()
		.map(|frame| {
			let buffer: RgbaImage = frame.clone().into_buffer();
			let dynamic_image = DynamicImage::from(buffer);

			let mut expanded_img = expand_image_top(&dynamic_image, balloon.height());

			overlay(&mut expanded_img, &balloon, 0, 0);

			Frame::new(RgbaImage::from(expanded_img))
		})
		.collect();

	save_gif(frames, output, None)?;

	Ok(())
}

async fn speech_video(input: PathBuf, output: PathBuf) -> Result<()> {
	let (video_width, video_height) = get_video_resolution(input.clone()).await?;
	let balloon = image::open(SPEECH_BALLOON_PATH)?;
	let balloon_height = balloon.height();
	let new_height = video_height + balloon_height;

	let status = invoke_ffmpeg_command()
		.arg("-y")
		.arg("-i")
		.arg(&input)
		.arg("-i")
		.arg(SPEECH_BALLOON_PATH)
		.arg("-filter_complex")
		.arg(format!(
			"[0:v]pad=width={}:height={}:x=0:y={}[padded]; \
             [1:v]scale={}:{}:flags=neighbor[scaled]; \
             [padded][scaled]overlay=0:0",
			video_width, new_height, balloon_height, video_width, balloon_height
		))
		.arg(&output)
		.status()
		.await?;

	if !status.success() {
		return Err(anyhow!("Failed to overlay the image"));
	}

	Ok(())
}

fn load_and_resize_balloon<P>(path: P, width: u32) -> Result<DynamicImage>
where
	P: AsRef<Path>,
{
	let balloon = image::open(path)?;
	let resized_balloon = balloon.resize_exact(width, balloon.height(), FilterType::Nearest);

	Ok(resized_balloon)
}
