use akashi_shared::{AkashiContext, AkashiResult};
use poise::serenity_prelude as serenity;
use translators::{GoogleTranslator, Translator};

// todo: change this command, i dont want a crate for this shi

/// Translate text
#[poise::command(prefix_command, slash_command)]
pub async fn translate(
	ctx: AkashiContext<'_>,
	#[description = "Language to translate to"] target: String,
	#[description = "Text to translate"]
	#[rest]
	text: String,
) -> AkashiResult {
	let translator = GoogleTranslator::default();

	let translation = translator.translate_async(&text, "", &target).await?;

	ctx.reply(format!("```\n{translation}\n```")).await?;
	Ok(())
}

#[poise::command(context_menu_command = "Translate")]
pub async fn context_menu_translate(
	ctx: AkashiContext<'_>,
	#[description = "Message to translate"] msg: serenity::Message,
) -> AkashiResult {
	let translator = GoogleTranslator::default();

	let translation = translator.translate_async(&msg.content, "", "en").await?;

	ctx.reply(format!("```\n{translation}\n```",)).await?;
	Ok(())
}
