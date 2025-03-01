use akashi_shared::{AkashiContext, AkashiResult};
use akashi_shared::error::AkashiErrors;

// omg i gotta refactor this whole code its so shit lolololdifhugbfsjd

#[poise::command(prefix_command, owners_only, hide_in_help, aliases("ddc"))]
pub async fn dev_disable_command(ctx: AkashiContext<'_>, #[rest] commands: String) -> AkashiResult {
    let cache = ctx.data().cache.lock().await.clone();
    let cache_disabled_commands = cache
        .get_item("disabled_commands", None)
        .await?
        .unwrap_or_default();

    if cache_disabled_commands.contains(&commands) {
        return Err(AkashiErrors::Custom("Command(s) already disabled".to_string()).into());
    }

    let commands = commands.split(" ").collect::<Vec<_>>();

    let disabled_commands = cache_disabled_commands.split(',').collect::<Vec<_>>();
    let disabled_commands = disabled_commands
        .into_iter()
        .chain(commands.into_iter())
        .collect::<Vec<_>>();

    cache
        .set_item("disabled_commands", &disabled_commands.join(","), None)
        .await?;

    ctx.reply("Disabled command(s)").await?;

    Ok(())
}
