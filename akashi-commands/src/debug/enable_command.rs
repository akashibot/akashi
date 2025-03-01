use akashi_shared::{AkashiContext, AkashiResult, error::AkashiErrors};

// omg i gotta refactor this whole code its so shit lolololdifhugbfsjd

#[poise::command(prefix_command, owners_only, hide_in_help, aliases("dec"))]
pub async fn dev_enable_command(ctx: AkashiContext<'_>, #[rest] commands: String) -> AkashiResult {
	let cache = ctx.data().cache.lock().await.clone();
	let cache_disabled_commands = cache
		.get_item("disabled_commands", None)
		.await?
		.unwrap_or_default();

	if !cache_disabled_commands.contains(&commands) {
		return Err(AkashiErrors::Custom("Command(s) already enabled".to_string()).into());
	}

	if cache_disabled_commands.is_empty() {
		return Err(AkashiErrors::Custom("No disabled commands found".to_string()).into());
	}

	let commands = commands.split(" ").collect::<Vec<_>>();

	let disabled_commands = cache_disabled_commands
		.split(',')
		.filter(|c| !commands.contains(c))
		.collect::<Vec<_>>();

	cache
		.set_item("disabled_commands", &disabled_commands.join(","), None)
		.await?;

	ctx.reply("Enabled command(s)").await?;

	Ok(())
}
