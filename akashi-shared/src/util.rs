use std::time::Duration;
use unstorage_rs::TransactionOptions;

pub fn seconds_to_video_duration(seconds: i64) -> String {
	let div_mod = |a, b| (a / b, a % b);

	let (minutes, seconds) = div_mod(seconds, 60);
	let (_, minutes) = div_mod(minutes, 60);

	format!("{minutes}:{seconds}")
}

pub fn cache_key<T: AsRef<str>>(args: &[T]) -> String {
	args.iter()
		.map(|arg| arg.as_ref().to_string())
		.collect::<Vec<String>>()
		.join(":")
}

pub fn parse_cache_key(key: &str) -> Vec<String> {
	key.split(":").map(|s| s.to_string()).collect()
}

pub fn common_transaction_options(secs: Option<u64>) -> TransactionOptions {
	TransactionOptions {
		headers: None,
		ttl: Some(Duration::from_secs(secs.unwrap_or(5)).as_millis() as u64),
	}
}
