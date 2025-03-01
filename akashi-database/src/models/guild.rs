use chrono::{NaiveDateTime, Utc};
use sqlx::{FromRow, PgPool, Result};

type Snowflake = String;

#[derive(Debug, FromRow)]
pub struct Guild {
	pub id: Snowflake,
	pub created_at: Option<NaiveDateTime>,
	pub board_cid: Option<Snowflake>,
	pub board_emoji: Option<String>,
	pub board_emoji_count: Option<i16>,
}
impl Guild {
	/// Create a guild
	pub async fn create(pool: &PgPool, id: String) -> Result<Guild> {
		let guild = query_as!(
			Self,
			r#"
            INSERT INTO guilds (id, created_at)
            VALUES ($1, $2)
            RETURNING *
            "#,
			id,
			Utc::now().naive_utc()
		)
		.fetch_one(pool)
		.await?;

		debug!("Created guild: {:?}", guild);

		Ok(guild)
	}

	/// Delete a guild by its ID
	pub async fn delete(pool: &PgPool, id: String) -> Result<()> {
		query!(
			r#"
            DELETE FROM guilds
            WHERE id = $1
            "#,
			id
		)
		.execute(pool)
		.await?;

		debug!("Deleted guild: {:?}", id);

		Ok(())
	}

	/// Get a guild by its ID
	pub async fn get(pool: &PgPool, id: String) -> Result<Option<Guild>> {
		let guild = query_as!(
			Self,
			r#"
            SELECT *
            FROM guilds
            WHERE id = $1
            "#,
			id
		)
		.fetch_optional(pool)
		.await?;

		Ok(guild)
	}
}
