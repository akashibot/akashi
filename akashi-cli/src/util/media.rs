use image::ImageFormat;
use std::path::PathBuf;

#[derive(Debug, PartialEq)]
pub(crate) enum MediaType {
	Static,
	Gif,
	Video,
	Unknown,
}
impl MediaType {
	pub fn from_path(path: PathBuf) -> Self {
		let kind = match infer::get_from_path(&path) {
			Ok(Some(kind)) => kind,
			_ => return Self::Unknown,
		};

		match kind.mime_type() {
			"image/png" | "image/jpeg" | "image/bmp" | "image/tiff" | "image/webp" => Self::Static,
			"image/gif" => Self::Gif,
			"video/mp4" | "video/quicktime" | "video/x-msvideo" | "video/x-matroska" => Self::Video,
			_ => Self::Unknown,
		}
	}
}

impl From<ImageFormat> for MediaType {
	fn from(format: ImageFormat) -> Self {
		match format {
			ImageFormat::Png
			| ImageFormat::Jpeg
			| ImageFormat::Bmp
			| ImageFormat::Tiff
			| ImageFormat::WebP => MediaType::Static,
			ImageFormat::Gif => MediaType::Gif,
			_ => MediaType::Unknown,
		}
	}
}
