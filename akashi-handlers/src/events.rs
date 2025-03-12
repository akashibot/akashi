use akashi_shared::{AkashiData, database::models::guild::Guild};
use chrono::{Duration, Utc};
use poise::serenity_prelude::{Guild as SerenityGuild, *};

pub struct Handler;

#[async_trait]
impl EventHandler for Handler {
	async fn ready(&self, _: Context, ready: Ready) {
		info!("{} is now online", ready.user.name);
	}

	async fn guild_create(&self, ctx: Context, guild: SerenityGuild, _: Option<bool>) {
		let now = Utc::now();
		let threshold = Timestamp::from(now - Duration::minutes(2));

		let data = ctx.data::<AkashiData>();
		let is_new_guild = guild.joined_at > threshold;

		let db = data.database.lock().await;
		let pool = db.pool.clone();

		if is_new_guild {
			match Guild::create(&pool, guild.id.to_string()).await {
				Ok(g) => debug!("created new guild: {g:#?}"),
				Err(e) => error!("while trying to create new guild: {e:#?}"),
			};
		}
	}

	async fn guild_delete(
		&self,
		ctx: Context,
		incomplete: UnavailableGuild,
		_: Option<SerenityGuild>,
	) {
		let data = ctx.data::<AkashiData>();
		let db = data.database.lock().await;
		let pool = db.pool.clone();

		match Guild::delete(&pool, incomplete.id.to_string()).await {
			Ok(_) => debug!("deleted guild row Akashi was removed from"),
			Err(e) => error!("while trying to remove a guild: {e:#?}"),
		};
	}
}
