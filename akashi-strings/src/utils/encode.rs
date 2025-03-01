use std::borrow::Cow;

/// Percent-encodes every byte except alphanumerics and `-`, `_`, `.`, `~`. Assumes UTF-8 encoding.
///
/// Call `.into_owned()` if you need a `String`
#[inline(always)]
pub fn encode(data: &str) -> Cow<str> {
	encode_binary(data.as_bytes())
}

/// Percent-encodes every byte except alphanumerics and `-`, `_`, `.`, `~`.
#[inline]
pub fn encode_binary(data: &[u8]) -> Cow<str> {
	// add maybe extra capacity, but try not to exceed allocator's bucket size
	let mut escaped = String::with_capacity(data.len() | 15);
	let unmodified = append_string(data, &mut escaped, true);
	if unmodified {
		return Cow::Borrowed(unsafe {
			// encode_into has checked it's ASCII
			std::str::from_utf8_unchecked(data)
		});
	}
	Cow::Owned(escaped)
}

fn append_string(data: &[u8], escaped: &mut String, may_skip: bool) -> bool {
	encode_into(data, may_skip, |s| {
		escaped.push_str(s);
		Ok::<_, std::convert::Infallible>(())
	})
	.unwrap()
}

fn encode_into<E>(
	mut data: &[u8],
	may_skip_write: bool,
	mut push_str: impl FnMut(&str) -> Result<(), E>,
) -> Result<bool, E> {
	let mut pushed = false;
	loop {
		// Fast path to skip over safe chars at the beginning of the remaining string
		let ascii_len = data
			.iter()
			.take_while(
				|&&c| matches!(c, b'0'..=b'9' | b'A'..=b'Z' | b'a'..=b'z' |  b'-' | b'.' | b'_' | b'~'),
			)
			.count();

		let (safe, rest) = if ascii_len >= data.len() {
			if !pushed && may_skip_write {
				return Ok(true);
			}
			(data, &[][..]) // redundant to optimize out a panic in split_at
		} else {
			data.split_at(ascii_len)
		};
		pushed = true;
		if !safe.is_empty() {
			push_str(unsafe { std::str::from_utf8_unchecked(safe) })?;
		}
		if rest.is_empty() {
			break;
		}

		match rest.split_first() {
			Some((byte, rest)) => {
				let enc = &[b'%', to_hex_digit(byte >> 4), to_hex_digit(byte & 15)];
				push_str(unsafe { std::str::from_utf8_unchecked(enc) })?;
				data = rest;
			}
			None => break,
		};
	}
	Ok(false)
}

#[allow(unreachable_patterns)]
#[inline]
fn to_hex_digit(digit: u8) -> u8 {
	match digit {
		0..=9 => b'0' + digit,
		10..=255 => b'A' - 10 + digit,
		_ => 0,
	}
}
