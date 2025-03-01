use chrono::{NaiveDateTime, Utc};
use sqlx::{PgPool, Result};

type Snowflake = String;

#[derive(Debug, FromRow)]
pub struct User {
	pub id: Snowflake,
	pub created_at: Option<NaiveDateTime>,
	pub rep: Option<i32>,
}
impl User {
	/// Create an user
	pub async fn create(pool: &PgPool, id: String) -> Result<User> {
		let user = query_as!(
			Self,
			r#"
            INSERT INTO users (id, created_at)
            VALUES ($1, $2)
            RETURNING *
            "#,
			id,
			Utc::now().naive_utc()
		)
		.fetch_one(pool)
		.await?;

		debug!("Created user: {:?}", user);

		Ok(user)
	}

	/// Delete an user by its ID
	pub async fn delete(pool: &PgPool, id: String) -> Result<()> {
		query!(
			r#"
            DELETE FROM users
            WHERE id = $1
            "#,
			id
		)
		.execute(pool)
		.await?;

		debug!("Deleted user: {:?}", id);

		Ok(())
	}

	/// Get an user by its ID
	pub async fn get(pool: &PgPool, id: String) -> Result<Option<User>> {
		let user = query_as!(
			Self,
			r#"
            SELECT *
            FROM users
            WHERE id = $1
            "#,
			id
		)
		.fetch_optional(pool)
		.await?;

		Ok(user)
	}
}
