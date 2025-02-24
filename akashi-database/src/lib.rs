mod error;
pub mod models;

#[macro_use]
extern crate tracing;

#[macro_use]
extern crate sqlx;

use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;

pub struct AkashiDatabase {
    pub pool: PgPool,
}
impl AkashiDatabase {
    pub async fn new() -> sqlx::Result<Self> {
        let url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

        let pool = PgPoolOptions::new()
            .max_connections(1)
            .connect(&url)
            .await?;

        // Set the search path to public
        sqlx::query!("SET search_path TO public")
            .execute(&pool)
            .await?;

        Ok(AkashiDatabase { pool })
    }
}
