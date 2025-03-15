use akashi_shared::{AkashiData, database::models::guild::Guild};
use chrono::{Duration, Utc};
use poise::serenity_prelude::{Guild as SerenityGuild, *};

pub struct Handler;

#[async_trait]
impl EventHandler for Handler {
	async fn ready(&self, ctx: Context, ready: Ready) {
		info!("{} is now online", ready.user.name);

		#[cfg(debug_assertions)]
		drop(ctx); // cuz atm we aint using this

		#[cfg(not(debug_assertions))]
		{
			use akashi_guild_poster::AkashiGuildPoster;
			use std::time::Duration as StdDuration;
			use tokio::time::sleep;

			let topgg_token = std::env::var("TOPGG_TOKEN").unwrap_or("missing".to_string());
			let dlistgg_token = std::env::var("DLISTGG_TOKEN").unwrap_or("missing".to_string());

			let guild_poster =
				AkashiGuildPoster::new(ready.user.id.to_string(), topgg_token, dlistgg_token);

			let guild_count = ready.guilds.len() as u64;

			tokio::spawn(async move {
				debug!("Posting {guild_count} guilds to botlists");

				guild_poster.post_dlist(guild_count).await.unwrap();
				guild_poster.post_topgg(guild_count).await.unwrap();

				info!("Posted guild count, see you in 12h");

				sleep(StdDuration::from_millis(43_20_00_00)).await;
			});
		}
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
				Ok(_) => (),
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
