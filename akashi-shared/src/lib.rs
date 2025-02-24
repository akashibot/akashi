pub mod structs;
pub mod util;

use akashi_database::AkashiDatabase;
use dashmap::DashSet;
use poise::futures_util::lock::Mutex;
use std::sync::Arc;
use std::time::Instant;
use unstorage_rs::UnstorageClient;

pub type AkashiError = Box<dyn std::error::Error + Send + Sync>;
pub type AkashiContext<'a> = poise::Context<'a, AkashiData, AkashiError>;
pub type AkashiResult<T = ()> = Result<T, AkashiError>;

pub extern crate akashi_database as database;

#[macro_use]
extern crate tracing;

pub struct AkashiData {
    pub uptime: Instant,
    pub database: Mutex<Arc<AkashiDatabase>>,
    pub cache: Mutex<Arc<UnstorageClient>>,
    pub disabled_commands: DashSet<String>,
}

impl AkashiData {
    pub async fn new() -> Self {
        let disabled_commands = DashSet::<String>::new();

        #[cfg(debug_assertions)]
        {
            disabled_commands.insert(String::from("reminder create"));
        }

        disabled_commands.insert(String::from("invidious"));

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
            disabled_commands,
        }
    }
}
