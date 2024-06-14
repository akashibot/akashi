#![allow(dead_code)]

use std::cmp::min;
use std::ops::Range;

#[derive(Debug, PartialEq)]
pub enum Type {
    Gif,
    Jpeg,
    Png,
    Webp,
    MP4,
    Webm,
    MP3,
}
impl Type {
    pub fn as_str(&self) -> &'static str {
        match self {
            Type::Gif => "gif",
            Type::Jpeg => "jpeg",
            Type::Png => "png",
            Type::Webp => "webp",
            Type::MP4 => "mp4",
            Type::Webm => "webm",
            Type::MP3 => "mp3",
        }
    }
    pub fn as_mime(&self) -> &'static str {
        match self {
            Type::Gif => "image/gif",
            Type::Jpeg => "image/jpeg",
            Type::Png => "image/png",
            Type::Webp => "image/webp",
            Type::MP4 => "video/mp4",
            Type::Webm => "video/webm",
            Type::MP3 => "audio/mpeg",
        }
    }
    pub fn is_video(&self) -> bool {
        matches!(self, Type::MP4 | Type::Webm)
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
        [0x1A, 0x45, 0xDF, 0xA3, ..] => Some(Type::Webm),
        [0x49, 0x44, 0x33, ..] /* ID3 tagged */ | [0xff, 0xfb, ..] /* untagged */ => Some(Type::MP3),
        _ if check_webp(buf) => Some(Type::Webp),
        _ if check_mp4(buf) => Some(Type::MP4),
        _ => None,
    }
}
