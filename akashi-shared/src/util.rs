use poise::{
	Context, CreateReply, serenity_prelude as serenity,
	serenity_prelude::{CreateEmbed, CreateEmbedFooter},
};
use std::time::Duration;
use unstorage_rs::TransactionOptions;

pub fn seconds_to_video_duration(seconds: i64) -> String {
	let div_mod = |a, b| (a / b, a % b);

	let (minutes, seconds) = div_mod(seconds, 60);
	let (_, minutes) = div_mod(minutes, 60);

	format!("{minutes}:{seconds}")
}

pub async fn paginate<U: Send + Sync + 'static, E>(
	ctx: Context<'_, U, E>,
	pages: &[CreateEmbed<'_>],
) -> Result<(), serenity::Error> {
	// Define some unique identifiers for the navigation buttons
	let ctx_id = ctx.id();
	let prev_button_id = format!("{}prev", ctx_id);
	let next_button_id = format!("{}next", ctx_id);

	// Send the embed with the first page as content
	let buttons = [
		serenity::CreateButton::new(&prev_button_id).emoji('◀'),
		serenity::CreateButton::new(&next_button_id).emoji('▶'),
	];

	let components = [serenity::CreateActionRow::buttons(&buttons)];
	let first_footer = CreateEmbedFooter::new(format!("Page 0 of {}", pages.len()));
	let reply = CreateReply::default()
		.embed(CreateEmbed::from(pages.first().unwrap().clone()).footer(first_footer))
		.components(&components);

	ctx.send(reply).await?;

	// Loop through incoming interactions with the navigation buttons
	let mut current_page: usize = 0;
	let shard_messenger = &ctx.serenity_context().shard;
	while let Some(press) =
		serenity::collector::ComponentInteractionCollector::new(shard_messenger.clone())
			// We defined our button IDs to start with `ctx_id`. If they don't, some other command's
			// button was pressed
			.filter(move |press| press.data.custom_id.starts_with(&ctx_id.to_string()))
			// Timeout when no navigation button has been pressed for 24 hours
			.timeout(Duration::from_secs(60))
			.await
	{
		// Depending on which button was pressed, go to next or previous page
		match press.data.custom_id.as_str() {
			x if x == next_button_id => {
				current_page += 1;
				if current_page >= pages.len() {
					current_page = 0;
				}
			}
			x if x == prev_button_id => {
				current_page = current_page.checked_sub(1).unwrap_or(pages.len() - 1);
			}
			_ => {
				// This is an unrelated button interaction
				continue;
			}
		}

		let footer = CreateEmbedFooter::new(format!("Page {} of {}", current_page, pages.len()));

		// Update the message with the new page contents
		press
			.create_response(
				ctx.http(),
				serenity::CreateInteractionResponse::UpdateMessage(
					serenity::CreateInteractionResponseMessage::new()
						.embed(CreateEmbed::from(pages[current_page].clone()).footer(footer)),
				),
			)
			.await?;
	}

	Ok(())
}

pub fn cache_key<T: AsRef<str>>(args: &[T]) -> String {
	args.iter()
		.map(|arg| arg.as_ref().to_string())
		.collect::<Vec<String>>()
		.join(":")
}

pub fn parse_cache_key(key: &str) -> Vec<String> {
	key.split(":").map(|s| s.to_string()).collect()
}

pub fn common_transaction_options(secs: Option<u64>) -> TransactionOptions {
	TransactionOptions {
		headers: None,
		ttl: Some(Duration::from_secs(secs.unwrap_or(5)).as_millis() as u64),
	}
}
