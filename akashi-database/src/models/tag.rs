use chrono::{NaiveDateTime, Utc};
use sqlx::{PgPool, Result};

type Snowflake = String;

#[derive(Debug, FromRow)]
pub struct Tag {
	pub guild_id: Snowflake,
	pub user_id: Snowflake,
	pub name: String,
	pub content: String,
	pub created_at: NaiveDateTime,
	pub views: i32,
}
impl Tag {
	/// Create a tag
	pub async fn create(
		pool: &PgPool,
		guild_id: String,
		user_id: String,
		name: String,
		content: String,
	) -> Result<Tag> {
		let tag = query_as!(
			Self,
			r#"
            INSERT INTO tags (guild_id, user_id, name, content, created_at, views)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            "#,
			guild_id,
			user_id,
			name,
			content,
			Utc::now().naive_utc(),
			0
		)
		.fetch_one(pool)
		.await?;

		debug!("Created tag: {:?}", tag);

		Ok(tag)
	}

	/// Delete a tag by its name
	pub async fn delete(pool: &PgPool, guild_id: String, name: String) -> Result<()> {
		query!(
			r#"
            DELETE FROM tags
            WHERE guild_id = $1 AND name = $2
            "#,
			guild_id,
			name
		)
		.execute(pool)
		.await?;

		debug!("Deleted tag: {:?} in {:?}", name, guild_id);

		Ok(())
	}

	/// Get a tag by its name
	pub async fn get(pool: &PgPool, guild_id: String, name: String) -> Result<Option<Tag>> {
		let tag = query_as!(
			Self,
			r#"
            SELECT *
            FROM tags
            WHERE guild_id = $1 AND name = $2
            "#,
			guild_id,
			name
		)
		.fetch_optional(pool)
		.await?;

		Ok(tag)
	}

	/// Edit a tag by its name
	pub async fn edit(
		pool: &PgPool,
		guild_id: String,
		name: String,
		content: String,
	) -> Result<Tag> {
		let tag = query_as!(
			Self,
			r#"
            UPDATE tags
            SET content = $1
            WHERE guild_id = $2 AND name = $3
            RETURNING *
            "#,
			content,
			guild_id,
			name
		)
		.fetch_one(pool)
		.await?;

		debug!("Edited tag: {:?}", tag);

		Ok(tag)
	}

	/// Get all tags in a guild
	pub async fn list_guild(pool: &PgPool, guild_id: String) -> Result<Vec<Tag>> {
		let tags = query_as!(
			Tag,
			r#"
            SELECT *
            FROM tags
            WHERE guild_id = $1
            "#,
			guild_id
		)
		.fetch_all(pool)
		.await?;

		Ok(tags)
	}

	/// Get all tags in a guild with a user
	pub async fn list_user(pool: &PgPool, guild_id: String, user_id: String) -> Result<Vec<Tag>> {
		let tags = query_as!(
			Tag,
			r#"
            SELECT *
            FROM tags
            WHERE guild_id = $1 AND user_id = $2
            "#,
			guild_id,
			user_id
		)
		.fetch_all(pool)
		.await?;

		Ok(tags)
	}

	/// Increment the views of a tag
	pub async fn increment_views(pool: &PgPool, guild_id: String, name: String) -> Result<()> {
		query_as!(
			Tag,
			r#"
            UPDATE tags
            SET views = views + 1
            WHERE guild_id = $1 AND name = $2
            "#,
			guild_id,
			name
		)
		.execute(pool)
		.await?;

		Ok(())
	}
}
