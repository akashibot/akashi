#![deny(clippy::all)]

use lru::LruCache;
use poise::serenity_prelude::futures::lock::Mutex;
use poise::serenity_prelude::{self as serenity, ActivityData, ChannelId, UserId};
use std::num::NonZeroUsize;
use std::{
    collections::HashSet,
    env::var,
    sync::Arc,
    time::Duration,
};

mod commands;
mod utils;

// Types used by all command functions
type Error = Box<dyn std::error::Error + Send + Sync>;
type Context<'a> = poise::Context<'a, Data, Error>;

// Custom user data passed to all command functions
pub struct Data {
    api_url: String,
    sysinfo: Mutex<sysinfo::System>,
    reqwest_client: reqwest::Client,
    cached_images: Mutex<LruCache<ChannelId, String>>,
}

// #[derive(Deserialize, Debug)]
// struct Env {
//     discord_token: String,
//     ipx_host: String,
// }

async fn on_error(error: poise::FrameworkError<'_, Data, Error>) {
    // This is our custom error handler
    // They are many errors that can occur, so we only handle the ones we want to customize
    // and forward the rest to the default handler
    match error {
        poise::FrameworkError::Setup { error, .. } => panic!("Failed to start bot: {error:?}"),
        poise::FrameworkError::Command { error, ctx, .. } => {
            // remove the quotes from error
            ctx.say(error.to_string()).await.unwrap();
            println!("Error in command `{}`: {:?}", ctx.command().name, error);
        }
        error => {
            if let Err(e) = poise::builtins::on_error(error).await {
                println!("Error while handling error: {e}");
            }
        }
    }
}

#[tokio::main]
async fn main() {
    let _ = dotenvy::dotenv();

    let mut bot_owners = HashSet::<UserId>::default();

    bot_owners.insert(1076700780175831100.into());

    let options = poise::FrameworkOptions {
        commands: vec![
            // Util commands
            commands::util::help::help(),
            commands::util::stats::stats(),
            // Image commands
            commands::image::invert::invert(),
            commands::image::resize::resize(),
            commands::image::quality::quality(),
            commands::image::to::to(),
            commands::image::blur::blur(),
            commands::image::grayscale::grayscale(),
            // Meme commands
            commands::meme::caption::caption(),
            commands::meme::speech::speech(),
        ],
        event_handler: |ctx, event, framework, data| {
            Box::pin(event_handler(ctx, event, framework, data))
        },
        prefix_options: poise::PrefixFrameworkOptions {
            prefix: Some(",".into()),
            edit_tracker: Some(Arc::new(poise::EditTracker::for_timespan(
                Duration::from_secs(3600),
            ))),
            additional_prefixes: vec![poise::Prefix::Literal("akashi")],
            mention_as_prefix: true,
            ..Default::default()
        },
        // The global error handler for all error cases that may occur
        on_error: |error| Box::pin(on_error(error)),
        // This code is run before every command
        pre_command: |ctx| {
            Box::pin(async move {
                println!("Executing command {}...", ctx.command().qualified_name);
            })
        },
        // This code is run after a command if it was successful (returned Ok)
        post_command: |ctx| {
            Box::pin(async move {
                println!("Executed command {}!", ctx.command().qualified_name);
            })
        },
        // Every command invocation must pass this check to continue execution
        command_check: Some(|ctx| {
            Box::pin(async move {
                if ctx.author().id == 858367536240394259 {
                    // sawako id
                    return Ok(false);
                }

                Ok(true)
            })
        }),
        // Enforce command checks even for owners (enforced by default)
        // Set to true to bypass checks, which is useful for testing
        skip_checks_for_owners: false,
        owners: bot_owners,
        ..Default::default()
    };

    let framework = poise::Framework::builder()
        .setup(move |ctx, _, framework| {
            Box::pin(async move {
                poise::builtins::register_globally(ctx, &framework.options().commands).await?;
                Ok(Data {
                    api_url: var("API_URL").expect("Missing `API_URL` env var."),
                    sysinfo: Mutex::new(sysinfo::System::new()),
                    reqwest_client: reqwest::Client::new(),
                    cached_images: LruCache::new(NonZeroUsize::new(10).unwrap()).into(),
                })
            })
        })
        .options(options)
        .build();

    let token = var("DISCORD_TOKEN")
        .expect("Missing `DISCORD_TOKEN` env var, see README for more information.");
    let intents =
        serenity::GatewayIntents::non_privileged() | serenity::GatewayIntents::MESSAGE_CONTENT;

    let client = serenity::ClientBuilder::new(token, intents)
        .framework(framework)
        .await;

    client.unwrap().start().await.unwrap();
}

async fn event_handler(
    ctx: &serenity::Context,
    event: &serenity::FullEvent,
    _framework: poise::FrameworkContext<'_, Data, Error>,
    data: &Data,
) -> Result<(), Error> {
    match event {
        serenity::FullEvent::Ready { data_about_bot, .. } => {
            ctx.set_activity(Some(ActivityData::playing("with images")));
            println!("Logged in as {}", data_about_bot.user.name);
        }
        serenity::FullEvent::Message { new_message } => {
            if !new_message.attachments.is_empty() {
                let mut cached_images = data.cached_images.lock().await;
                for attachment in &new_message.attachments {
                    let url = attachment.proxy_url.clone();
                    cached_images.put(new_message.channel_id, url.to_owned());
                }
            } else if Some(new_message.embeds.first().unwrap().image.clone()).is_some() {
                let mut cached_images = data.cached_images.lock().await;
                    let url = new_message.embeds.first().unwrap().image.as_ref().unwrap().url.clone();
                    cached_images.put(new_message.channel_id, url.to_owned());
            }
        }
        _ => {}
    }
    Ok(())
}
