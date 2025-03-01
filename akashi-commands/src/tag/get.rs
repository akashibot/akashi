use akashi_shared::database::models::tag::Tag;
use akashi_shared::error::AkashiErrors;
use akashi_shared::{AkashiContext, AkashiError, AkashiResult};
use dashmap::DashMap;
use poise::serenity_prelude::{AutocompleteChoice, CreateAutocompleteResponse};
use tagscript::{Adapter, Block, Interpreter, block};

pub async fn autocomplete_tag_name<'a>(
	ctx: AkashiContext<'a>,
	partial: &'a str,
) -> CreateAutocompleteResponse<'a> {
	let database = ctx.data().database.lock().await.clone();
	let pool = database.pool.clone();

	let guild_id = match ctx.guild_id() {
		Some(id) => id.to_string(),
		None => return CreateAutocompleteResponse::new(),
	};

	let tags = Tag::list_guild(&pool, guild_id).await.unwrap_or_default();

	let choices: Vec<_> = tags
		.into_iter()
		.filter(move |tag| tag.name.clone().starts_with(partial))
		.map(|t| {
			AutocompleteChoice::new(
				format!("{} — 👁️ {}", t.name.clone(), t.views.to_string()),
				t.name,
			)
		})
		.collect();

	CreateAutocompleteResponse::new().set_choices(choices)
}

/// Get a tag and view its content
///
/// <prefix>tag get <tag_name> [args]
#[poise::command(slash_command, prefix_command, aliases(""))]
pub async fn get(
	ctx: AkashiContext<'_>,
	#[description = "Tag name"]
	#[autocomplete = "autocomplete_tag_name"]
	name: String,
	#[description = "Tag args"]
	#[rest]
	args: Option<String>,
) -> AkashiResult {
	let database = ctx.data().database.lock().await.clone();
	let pool = database.pool.clone();

	let guild_id = match ctx.guild_id() {
		Some(id) => id.to_string(),
		None => return Err(AkashiErrors::OnlyGuild.into()),
	};

	let tag = Tag::get(&pool, guild_id.clone(), name.clone()).await?;

	match tag {
		Some(tag) => {
			let interpreter = setup_interpreter();
			let vars = DashMap::<String, Adapter>::new();

			vars.insert(
				"args".to_string(),
				Adapter::String(args.unwrap_or_default()),
			);

			let parsed = interpreter.process(tag.content, Some(vars), None)?;

			debug!("tag: {:#?}", parsed);

			Tag::increment_views(&pool, guild_id, name).await?;

			let body = match parsed.body {
				Some(body) => body,
				None => return Err(AkashiErrors::TagEmpty.into()),
			};

			ctx.reply(format!(
				"{body}\n-# :eye_in_speech_bubble: This a tag's content"
			))
			.await?;
		}
		None => return Err(AkashiErrors::TagNotFound.into()),
	}

	Ok(())
}

fn setup_interpreter() -> Interpreter {
	let blocks: Vec<Box<dyn Block>> = vec![
		Box::from(block::RangeBlock {}),
		Box::from(block::IfBlock {}),
		Box::from(block::AllBlock {}),
		// Box::from(block::StrictVariableGetterBlock {}),
		Box::from(block::LooseVariableGetterBlock {}),
		Box::from(block::AnyBlock {}),
		Box::from(block::RandomBlock {}),
	];

	Interpreter::new(blocks)
}
