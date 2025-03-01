use akashi_shared::database::models::guild::Guild;
use akashi_shared::{AkashiData, AkashiError, AkashiResult};
use chrono::{Duration, Utc};
use poise::FrameworkContext;
use poise::serenity_prelude::{FullEvent, Timestamp};

type FrameworkCtx<'a> = FrameworkContext<'a, AkashiData, AkashiError>;

pub async fn event_handler(framework: FrameworkCtx<'_>, event: &FullEvent) -> AkashiResult {
	let data = framework.user_data().clone();

	match event {
		FullEvent::Ready { data_about_bot } => {
			info!("Client {} is now online", data_about_bot.user.name);

			let cache = data.cache.lock().await;

			let env_disabled_commands = std::env::var("DISABLED_COMMANDS").unwrap_or_default();
			let disabled_commands = env_disabled_commands.split(',').collect::<Vec<_>>();

			cache
				.set_item("disabled_commands", &disabled_commands.join(","), None)
				.await?;
		}
		FullEvent::GuildCreate { guild, .. } => {
			// thanks free
			let now = Utc::now();
			let threshold = Timestamp::from(now - Duration::minutes(1));

			let is_new_guild = guild.joined_at > threshold;

			let db = data.database.lock().await;
			let pool = db.pool.clone();

			if is_new_guild {
				Guild::create(&pool, guild.id.to_string()).await?;
			}
		}
		FullEvent::GuildDelete { incomplete, .. } => {
			let db = data.database.lock().await;
			let pool = db.pool.clone();

			Guild::delete(&pool, incomplete.id.to_string()).await?;
		}
		_ => debug!("found event {}", event.snake_case_name()),
	}

	Ok(())
}
