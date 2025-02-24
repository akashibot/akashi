use akashi_shared::structs::Reminder;
use akashi_shared::util::{cache_key, common_transaction_options};
use akashi_shared::{AkashiContext, AkashiError, AkashiResult};
use chrono::Utc;
use std::time::Duration;

/// Create a new personal reminder
#[poise::command(slash_command, prefix_command, aliases("new", "add"))]
pub async fn create(
    ctx: AkashiContext<'_>,
    #[description = "Reminder message"] message: String,
    #[description = "Reminder in..."] time: String,
) -> AkashiResult {
    let cache = ctx.data().cache.lock().await.clone();

    let user_reminders = cache
        .get_keys(&format!("reminders:{}", ctx.author().id), None)
        .await?;

    if let Some(reminders) = user_reminders {
        if reminders.len() == 5 {
            return Err(AkashiError::from(
                "you already have 5 active reminders (limit)",
            ));
        }
    }

    let time = parse_duration(&time)?;

    let date = Utc::now() + chrono::Duration::from_std(time).unwrap();
    let timestamp = date.timestamp();

    let reminder_key_string = cache_key(&[
        "reminders".to_string(),
        ctx.author().id.to_string(),
        timestamp.to_string(),
    ]);
    let reminder_key = reminder_key_string.as_str();

    cache
        .set_item_json::<Reminder>(
            reminder_key,
            &Reminder {
                user_id: ctx.author().id.to_string(),
                message: message.clone(),
                at: timestamp,
            },
            Some(&common_transaction_options(Some(time.as_secs() + 60 * 2))), // idk, delete 2 minutes after the reminder is due
        )
        .await?;

    ctx.reply(format!(
        "Created reminder: `{}`. I will remind you <t:{:?}:R>",
        message, timestamp
    ))
    .await?;
    Ok(())
}

pub fn parse_duration(input: &str) -> AkashiResult<Duration> {
    if input.is_empty() {
        return Err(AkashiError::from("Empty time"));
    }

    let (num_str, unit) = input.split_at(input.len() - 1);

    let num = num_str.parse::<u64>().map_err(|_| "Invalid number")?;

    match unit {
        "s" => Ok(Duration::from_secs(num)),
        "m" => Ok(Duration::from_secs(num * 60)),
        "h" => Ok(Duration::from_secs(num * 60 * 60)),
        "d" => Ok(Duration::from_secs(num * 24 * 60 * 60)),
        _ => Err(AkashiError::from(format!("Unknown unit: {}", unit))),
    }
}
