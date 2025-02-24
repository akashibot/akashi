use akashi_shared::database::models::guild::Guild;
#[cfg(not(debug_assertions))]
use akashi_shared::structs::Reminder;
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

            #[cfg(not(debug_assertions))]
            {
                let cache = data.cache.lock().await.clone();
                let http = framework.serenity_context.http.clone();

                tokio::spawn(async move {
                    if let Err(e) = Reminder::handle_due_reminders(cache, http).await {
                        error!("Error in reminder handler: {}", e);
                    }
                });
            }
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
