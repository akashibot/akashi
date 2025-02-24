mod create;

use akashi_shared::{AkashiContext, AkashiData, AkashiError, AkashiResult};
use poise::Command;

use create::create;

#[poise::command(
    prefix_command,
    slash_command,
    subcommands("create"),
    subcommand_required,
    aliases("rem", "alarm")
)]
async fn reminder(_: AkashiContext<'_>) -> AkashiResult {
    Ok(())
}

pub fn register() -> Vec<Command<AkashiData, AkashiError>> {
    vec![reminder()]
}
