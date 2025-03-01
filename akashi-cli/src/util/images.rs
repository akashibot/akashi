use image::{DynamicImage, GenericImageView, RgbaImage, imageops::overlay};

/// Expands the top of an image by a specified number of pixels.
pub(crate) fn expand_image_top(image: &DynamicImage, expand_pixels: u32) -> DynamicImage {
	let (width, height) = image.dimensions();

	let new_height = height + expand_pixels;
	let mut expanded_image = RgbaImage::new(width, new_height);

	overlay(&mut expanded_image, image, 0, expand_pixels as i64);

	DynamicImage::ImageRgba8(expanded_image)
}
