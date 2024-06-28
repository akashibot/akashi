use crate::{Context, Error};

/// Show this help menu
#[poise::command(prefix_command, track_edits, slash_command, category = "util")]
pub async fn help(
    ctx: Context<'_>,
    #[description = "Specific command to show help about"]
    #[autocomplete = "poise::builtins::autocomplete_command"]
    command: Option<String>,
) -> Result<(), Error> {
    poise::builtins::help(ctx, command.as_deref(), poise::builtins::HelpConfiguration {
        extra_text_at_bottom: "Akashi bot (rust rewrite)",
        ..Default::default()
    })
    .await?;

    Ok(())
}
