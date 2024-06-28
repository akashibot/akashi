use crate::{Context, Error};

/// Show this help menu
#[poise::command(prefix_command, track_edits, slash_command, category = "Util")]
pub async fn help(
    ctx: Context<'_>,
    #[description = "Specific command to show help about"]
    #[autocomplete = "poise::builtins::autocomplete_command"]
    command: Option<String>,
) -> Result<(), Error> {
    let bot_version = env!("CARGO_PKG_VERSION").to_string();
    poise::builtins::pretty_help(
        ctx,
        command.as_deref(),
        poise::builtins::PrettyHelpConfiguration {
            extra_text_at_bottom: format!("Akashi v{bot_version}").as_str(),

            ..Default::default()
        },
    )
    .await?;

    Ok(())
}
