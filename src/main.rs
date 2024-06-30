#![deny(clippy::all)]

use std::collections::HashSet;
use std::env::var;
use std::num::NonZeroUsize;
use std::sync::Arc;
use std::time::Duration;

use lru::LruCache;
use poise::serenity_prelude::futures::lock::Mutex;
use poise::serenity_prelude::{self as serenity, ActivityData, ChannelId, UserId};
use regex::Regex;
use utils::discord::cache::save_image_to_cache;

mod commands;
mod utils;

type Error = Box<dyn std::error::Error + Send + Sync>;
type Context<'a> = poise::Context<'a, Data, Error>;

pub struct Data {
    api_url: String,
    sysinfo: Mutex<sysinfo::System>,
    reqwest_client: reqwest::Client,
    cached_images: Mutex<LruCache<ChannelId, String>>,
}

async fn on_error(error: poise::FrameworkError<'_, Data, Error>) {
    match error {
        poise::FrameworkError::Setup { error, .. } => panic!("Failed to start bot: {:?}", error),
        poise::FrameworkError::Command { error, ctx, .. } => {
            println!("Error in command `{}`: {:?}", ctx.command().name, error,);
        }
        error => {
            if let Err(e) = poise::builtins::on_error(error).await {
                println!("Error while handling error: {}", e)
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
            commands::util::servers::servers(),
            
            // Image commands
            commands::image::invert::invert(),
            commands::image::resize::resize(),
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
            edit_tracker: Some(Arc::new(poise::EditTracker::for_timespan(Duration::from_secs(
                30,
            )))),
            additional_prefixes: vec![poise::Prefix::Literal("akashi")],
            mention_as_prefix: true,
            ..Default::default()
        },
        on_error: |error| Box::pin(on_error(error)),
        command_check: Some(|ctx| {
            Box::pin(async move {
                if ctx.author().id == 858367536240394259 {
                    // sawako id
                    return Ok(false);
                }

                Ok(true)
            })
        }),
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
                    cached_images: LruCache::new(NonZeroUsize::new(50).unwrap()).into(),
                })
            })
        })
        .options(options)
        .build();

    let token = var("DISCORD_TOKEN")
        .expect("Missing `DISCORD_TOKEN` env var, see README for more information.");
    let intents =
        serenity::GatewayIntents::non_privileged() | serenity::GatewayIntents::MESSAGE_CONTENT;

    let client = serenity::ClientBuilder::new(token, intents).framework(framework).await;

    client.unwrap().start().await.unwrap();
}

async fn event_handler(
    ctx: &serenity::Context,
    event: &serenity::FullEvent,
    _framework: poise::FrameworkContext<'_, Data, Error>,
    data: &Data,
) -> Result<(), Error> {
    match event {
        serenity::FullEvent::Ready {
            data_about_bot, ..
        } => {
            ctx.set_activity(Some(ActivityData::playing("with images")));
            println!("Logged in as {}", data_about_bot.user.name);
        },
        serenity::FullEvent::Message {
            new_message,
        } => {
            // println!("message: {:#?}", new_message);
            if !new_message.attachments.is_empty() {
                let first_attachment = new_message.attachments.first().unwrap();

                if !first_attachment.proxy_url.is_empty() {
                    let url = first_attachment.proxy_url.clone();

                    save_image_to_cache(data, new_message.channel_id, url.to_owned()).await?;
                }
            }
            
            if !new_message.embeds.is_empty() {
                let first_embed = new_message.embeds.first().unwrap();

                // println!("embed: {:#?}", first_embed);

                if let Some(embed_image) = &first_embed.image {
                    let url = embed_image.proxy_url.clone();

                    save_image_to_cache(data, new_message.channel_id, url.expect("missing embed image url")).await?;
                }

                if let Some(embed_thumbnail) = &first_embed.thumbnail {
                    let url = embed_thumbnail.proxy_url.clone();

                    save_image_to_cache(data, new_message.channel_id, url.expect("missing embed thumbnail url")).await?;
                }
            }

            let image_url_regex = Regex::new(r"(https?://(?:[a-zA-Z0-9]+\.)*[a-zA-Z0-9]+(?:/\S*)?\.(?:jpe?g|png|gif|webp))").unwrap();
            if image_url_regex.is_match(&new_message.content) {
                let url = image_url_regex.captures(&new_message.content).unwrap().get(0).unwrap().as_str();

                save_image_to_cache(data, new_message.channel_id, url.to_owned()).await?;
            }


            // println!("{}", data.cached_images.lock().await.get(&new_message.channel_id).unwrap_or(&"none".to_string()));
        },
        _ => {},
    }
    Ok(())
}