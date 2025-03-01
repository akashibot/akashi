use anyhow::Result;
use image::codecs::gif::Repeat;
use image::{AnimationDecoder, Frame, codecs::gif::GifDecoder};
use std::{io::Cursor, path::PathBuf};
use tokio::{fs::File, io::AsyncReadExt};

pub(crate) async fn decode_gif(path: &PathBuf) -> Result<Vec<Frame>> {
	let mut buffer = Vec::new();

	File::open(path).await?.read_to_end(&mut buffer).await?;

	Ok(GifDecoder::new(Cursor::new(buffer))?
		.into_frames()
		.collect::<Result<Vec<_>, _>>()?)
}

pub(crate) fn save_gif(frames: Vec<Frame>, file: PathBuf, repeat: Option<Repeat>) -> Result<()> {
	let mut encoder = image::codecs::gif::GifEncoder::new(std::fs::File::create(file)?);

	encoder.set_repeat(repeat.unwrap_or(Repeat::Infinite))?;

	for frame in frames {
		encoder.encode_frame(frame)?;
	}

	Ok(())
}
