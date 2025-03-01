use akashi_shared::{AkashiContext, AkashiResult};

#[poise::command(prefix_command, owners_only)]
pub async fn register(ctx: AkashiContext<'_>) -> AkashiResult {
	poise::builtins::register_application_commands_buttons(ctx).await?;

	Ok(())
}
