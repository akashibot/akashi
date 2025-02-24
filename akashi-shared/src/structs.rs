use crate::AkashiResult;
use crate::util::cache_key;
use poise::serenity_prelude::{CreateMessage, Http, UserId};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::time::{Duration, sleep};
use unstorage_rs::UnstorageClient;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Reminder {
    pub user_id: String,
    pub at: i64,
    pub message: String,
}

impl Reminder {
    pub async fn handle_due_reminders(
        cache: Arc<UnstorageClient>,
        http: Arc<Http>,
    ) -> AkashiResult<()> {
        info!("Starting reminder handler");

        loop {
            let now = chrono::Utc::now().timestamp();
            debug!("Checking for due reminders at timestamp: {}", now);

            // Fetch and process reminders
            if let Err(e) = Self::process_due_reminders(&cache, &http, now).await {
                error!("Error processing reminders: {}", e);
            }

            sleep(Duration::from_secs(5)).await;
        }
    }

    /// Fetches and processes due reminders.
    async fn process_due_reminders(
        cache: &UnstorageClient,
        http: &Http,
        now: i64,
    ) -> AkashiResult<()> {
        let reminders = Self::fetch_reminders(cache).await?;

        for reminder in reminders {
            if Self::is_reminder_due(&reminder, now) {
                Self::send_reminder(http, &reminder).await?;
                Self::delete_reminder(cache, &reminder).await?
            }
        }

        Ok(())
    }

    /// Removes a reminder
    async fn delete_reminder(cache: &UnstorageClient, reminder: &Reminder) -> AkashiResult<()> {
        let key = cache_key(&[
            "reminder".to_string(),
            reminder.user_id.clone(),
            reminder.at.to_string(),
        ]);
        cache.remove_item(&key, None).await?; // anyways in case this function fails, cache kv has a TTL

        Ok(())
    }

    /// Fetches all reminders from the cache.
    async fn fetch_reminders(cache: &UnstorageClient) -> AkashiResult<Vec<Reminder>> {
        let reminder_keys = cache.get_keys("reminders", None).await?;
        let mut reminders = Vec::new();

        if let Some(keys) = reminder_keys {
            for key in keys {
                if let Some(reminder) = cache.get_item_json::<Reminder>(&key, None).await? {
                    reminders.push(reminder);
                }
            }
        }

        Ok(reminders)
    }

    /// Checks if a reminder is due.
    fn is_reminder_due(reminder: &Reminder, now: i64) -> bool {
        reminder.at <= now
    }

    /// Sends a reminder message to the user.
    async fn send_reminder(http: &Http, reminder: &Reminder) -> AkashiResult<()> {
        let user_id = reminder
            .user_id
            .parse::<u64>()
            .map_err(|_| format!("Failed to parse user ID: {}", reminder.user_id))?;

        let user = UserId::from(user_id);
        let builder = CreateMessage::new().content(format!("Reminder: {}", reminder.message));

        user.dm(http, builder).await?;

        Ok(())
    }
}
