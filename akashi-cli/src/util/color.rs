use dashmap::DashMap;
use image::{DynamicImage, GenericImageView, Pixel};

/// Detects the most abundant color in an image
pub(crate) fn most_abundant_color(img: &DynamicImage, threshold: u32) -> Option<image::Rgb<u8>> {
    let color_counts: DashMap<image::Rgb<u8>, u32> = DashMap::new();

    img.pixels().for_each(|(_, _, pixel)| {
        let rgb_pixel = pixel.to_rgb();

        color_counts
            .entry(rgb_pixel)
            .and_modify(|count| *count += 1)
            .or_insert(1);
    });

    color_counts
        .iter()
        .filter(|entry| *entry.value() >= threshold)
        .max_by_key(|entry| *entry.value())
        .map(|entry| *entry.key())
}
