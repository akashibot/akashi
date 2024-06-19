#![allow(dead_code)]

use std::cmp::min;
use std::ops::Range;

#[derive(Debug, PartialEq, poise::ChoiceParameter)]
pub enum Type {
    Gif,
    Jpeg,
    Png,
    Webp,
}

impl Type {
    pub fn as_str(&self) -> &'static str {
        match self {
            Type::Gif => "gif",
            Type::Jpeg => "jpeg",
            Type::Png => "png",
            Type::Webp => "webp",
        }
    }
    pub fn as_mime(&self) -> &'static str {
        match self {
            Type::Gif => "image/gif",
            Type::Jpeg => "image/jpeg",
            Type::Png => "image/png",
            Type::Webp => "image/webp",
        }
    }

    pub fn from_str(s: &str) -> Option<Type> {
        match s.to_lowercase().as_str() {
            "gif" => Some(Type::Gif),
            "jpeg" => Some(Type::Jpeg),
            "png" => Some(Type::Png),
            "webp" => Some(Type::Webp),
            _ => None,
        }
    }
}

const WEBP: [u8; 4] = [87, 69, 66, 80];
const MP4: [u8; 4] = [0x66, 0x74, 0x79, 0x70];

fn bounded_range(start: usize, end: usize, len: usize) -> Range<usize> {
    min(len, start)..min(len, end)
}

fn sig(that: &[u8], eq: &[u8]) -> bool {
    that[0..std::cmp::min(eq.len(), that.len())].eq(eq)
}

fn check_webp(that: &[u8]) -> bool {
    let bytes_offset_removed = &that[bounded_range(8, 12, that.len())];
    sig(bytes_offset_removed, &WEBP)
}

fn check_mp4(that: &[u8]) -> bool {
    let bytes_offset_removed = &that[bounded_range(4, 8, that.len())];
    sig(bytes_offset_removed, &MP4)
}

pub fn get_sig(buf: &[u8]) -> Option<Type> {
    match buf {
        [71, 73, 70, ..] => Some(Type::Gif),
        [255, 216, 255, ..] => Some(Type::Jpeg),
        [137, 80, 78, 71, 13, 10, 26, 10, ..] => Some(Type::Png),
        _ if check_webp(buf) => Some(Type::Webp),
        _ => None,
    }
}
