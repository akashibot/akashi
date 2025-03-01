use akashi_commands::register_all;
use akashi_handlers::events::event_handler;
use akashi_handlers::handlers::{command_check, on_error, post_command, pre_command};
use akashi_shared::AkashiData;
use poise::serenity_prelude::CreateAllowedMentions;
use poise::{EditTracker, serenity_prelude as serenity};
use poise::{FrameworkOptions, PrefixFrameworkOptions};
use serenity::cache::Settings as CacheSettings;
use std::sync::Arc;
use std::time::Duration;

mod tracing_utils;

#[tokio::main]
async fn main() {
	if cfg!(debug_assertions) {
		tracing_utils::init_for_test();
	} else {
		tracing_utils::init();
	}

	dotenvy::dotenv().ok();

	let framework_options = FrameworkOptions {
		commands: register_all(),
		prefix_options: PrefixFrameworkOptions {
			prefix: Some(",".into()),
			edit_tracker: Some(Arc::new(EditTracker::for_timespan(Duration::from_secs(60)))),
			..Default::default()
		},
		on_error: |error| Box::pin(on_error(error)),
		pre_command: |ctx| Box::pin(pre_command(ctx)),
		post_command: |ctx| Box::pin(post_command(ctx)),
		command_check: Some(|ctx| Box::pin(command_check(ctx))),
		event_handler: |framework, event| Box::pin(event_handler(framework, event)),
		allowed_mentions: Some(CreateAllowedMentions::new()),
		initialize_owners: true,
		..Default::default()
	};

	let discord_token = serenity::Token::from_env("DISCORD_TOKEN")
		.expect("DISCORD_TOKEN env variable is mandatory");
	let discord_intents =
		serenity::GatewayIntents::non_privileged() | serenity::GatewayIntents::MESSAGE_CONTENT;

	let mut cache_settings = CacheSettings::default();

	cache_settings.cache_guilds = true;
	cache_settings.cache_users = false;
	cache_settings.cache_channels = false;
	cache_settings.max_messages = 0;

	let client = serenity::ClientBuilder::new(discord_token, discord_intents)
		.framework(poise::Framework::new(framework_options))
		.data(Arc::new(AkashiData::new().await))
		.cache_settings(cache_settings)
		.await;

	client.unwrap().start().await.unwrap();
}
