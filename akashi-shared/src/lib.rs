pub extern crate akashi_database as database;

pub mod error;
pub mod util;

use akashi_database::AkashiDatabase;
use poise::futures_util::lock::Mutex;
use std::sync::Arc;
use std::time::Instant;
use unstorage_rs::UnstorageClient;

pub type AkashiError = Box<dyn std::error::Error + Send + Sync>;
pub type AkashiContext<'a> = poise::Context<'a, AkashiData, AkashiError>;
pub type AkashiResult<T = ()> = Result<T, AkashiError>;

pub struct AkashiData {
	pub uptime: Instant,
	pub database: Mutex<Arc<AkashiDatabase>>,
	pub cache: Mutex<Arc<UnstorageClient>>,
}

impl AkashiData {
	pub async fn new() -> Self {
		AkashiData {
			uptime: Instant::now(),
			database: Mutex::new(Arc::new(
				AkashiDatabase::new()
					.await
					.expect("Failed to connect to database"),
			)),
			cache: Mutex::new(Arc::new(UnstorageClient::new(
				"http://localhost:3000".to_string(),
				None,
			))),
		}
	}
}

#[cfg(test)]
mod tests {
	use unstorage_rs::UnstorageClient;

	// test to add and delete a cache entry
	#[tokio::test]
	async fn test_cache() {
		let cache = UnstorageClient::new("http://localhost:3000".to_string(), None);

		cache.set_item("test", "test", None).await.unwrap();
		let item = cache.get_item("test", None).await.unwrap();
		assert_eq!(item, Some("test".to_string()));

		cache.remove_item("test", None).await.unwrap();
		let item = cache.get_item("test", None).await.unwrap();
		assert_eq!(item, None);
	}
}
