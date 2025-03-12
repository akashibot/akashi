use akashi_shared::{AkashiContext, AkashiResult};
use akashi_strings::discord::{ansi::Ansi, markdown::Markdown, table::generate_table};
use dashmap::DashMap;
use poise::serenity_prelude::InstallationContext;

/// Extended information about commands
///
/// <prefix>help <command>
/// <prefix>help usage
/// <prefix>help
#[poise::command(slash_command, prefix_command, category = "util")]
pub async fn help(
	ctx: AkashiContext<'_>,
	#[rest]
	#[description = "Command to get help for"]
	command: Option<String>,
) -> AkashiResult {
	let framework_options = ctx.framework().options();
	let prefix = &framework_options.prefix_options.prefix;
	let commands = &framework_options
		.commands
		.iter()
		.filter(|c| !c.hide_in_help)
		.collect::<Vec<_>>();

	let subcommands = commands
		.iter()
		.flat_map(|c| c.subcommands.iter())
		.collect::<Vec<_>>();
	let all_commands = commands
		.iter()
		.chain(subcommands.iter())
		.filter(|p| !p.subcommand_required)
		.collect::<Vec<_>>();
	let bot_prefix = prefix.clone().unwrap_or_else(|| ",".into()).to_string();

	match command {
		Some(command) => {
			let command_help = all_commands
				.iter()
				.find(|c| c.qualified_name == command && !c.subcommand_required);

			match command_help {
				Some(cmd) => {
					let mut message =
						format!("Help for: {} command\n\n", cmd.qualified_name.fg_green());

					if let Some(description) = &cmd.description {
						message +=
							&format!("{} {} {}\n\n", ">".fg_black(), description, "<".fg_black());
					}

					if let Some(help_text) = &cmd.help_text {
						message += &format!("{}\n\n", help_text.fg_blue());
					} else {
						message += &"No help available\n\n".fg_yellow();
					}

					message += &format!(
						"Installable? {}\n\n",
						if cmd
							.install_context
							.as_deref()
							.unwrap_or(&[])
							.contains(&InstallationContext::User)
						{
							"Yes".fg_green()
						} else {
							"No".fg_red()
						}
					);

					if !cmd.parameters.is_empty() {
						message += &format!("{}\n", "Command parameters".fg_green());
						let options: Vec<(String, String)> = cmd
							.parameters
							.iter()
							.map(|p| {
								let description =
									p.description.as_deref().unwrap_or("No description");
								(
									format!(
										"{}{}",
										p.name.fg_blue(),
										if p.required {
											"*".fg_red()
										} else {
											"".to_string()
										}
									),
									description.to_string(),
								)
							})
							.collect();
						let options_table = generate_table(options.as_slice());
						message += &options_table;
					}

					let message = message.replace("<prefix>", &bot_prefix);
					ctx.say(message.codeblock("ansi")).await?;
				}
				None => return Err("Command not found".into()),
			}
		}
		None => {
			let mut message = format!("Displaying {} commands\n\n", all_commands.len().fg_green());

			let categories = DashMap::new();
			for cmd in all_commands.iter() {
				categories
					.entry(cmd.category.as_deref())
					.or_insert_with(Vec::new)
					.push(cmd);
			}

			for (category, commands) in categories {
				message += &format!(
					"{} {}: {}\n",
					category.unwrap_or("Uncategorized"),
					format!("({})", commands.len()).fg_green(),
					commands
						.iter()
						.map(|c| c.qualified_name.to_string())
						.collect::<Vec<_>>()
						.join(", ")
						.fg_blue()
				);
			}

			message += &format!(
				"\nRun {} to see detailed information about a command",
				format!("{bot_prefix}help [command]").fg_green()
			);

			let message = message.replace("<prefix>", &bot_prefix);
			ctx.say(message.codeblock("ansi")).await?;
		}
	}

	Ok(())
}
