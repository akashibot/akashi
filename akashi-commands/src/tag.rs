use akashi_shared::{AkashiContext, AkashiData, AkashiError, AkashiResult};
use poise::Command;

mod create;
mod edit;
mod get;
mod list;
mod raw;

use create::create;
use edit::edit;
use get::get;
use list::list;
use raw::raw;

#[poise::command(
    prefix_command,
    slash_command,
    subcommands("create", "get", "list", "raw", "edit"),
    subcommand_required,
    aliases("t")
)]
async fn tag(_: AkashiContext<'_>) -> AkashiResult {
    Ok(())
}

pub fn register() -> Vec<Command<AkashiData, AkashiError>> {
    vec![tag()]
}
