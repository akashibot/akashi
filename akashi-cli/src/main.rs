mod cli;
mod operations;
mod util;

use crate::cli::ImageOperation;
use crate::cli::commands::*;
use anyhow::Result;
use argh::FromArgs;
use std::path::PathBuf;

/// A simple async CLI tool with example commands
#[derive(FromArgs, Debug)]
pub(crate) struct AkashiCli {
	#[argh(subcommand)]
	command: Command,

	/// input file path
	#[argh(option)]
	input: PathBuf,

	/// output file path
	#[argh(option)]
	output: PathBuf,
}

#[derive(FromArgs, Debug, PartialEq)]
#[argh(subcommand)]
pub(crate) enum Command {
	Grayscale(GrayscaleCommand),
	Invert(InvertCommand),
	Speech(SpeechCommand),
	Rembg(RembgCommand),
}

impl ImageOperation for Command {
	async fn run(&self, input: &PathBuf, output: &PathBuf) {
		match self {
			Command::Grayscale(cmd) => cmd.run(input, output).await,
			Command::Invert(cmd) => cmd.run(input, output).await,
			Command::Speech(cmd) => cmd.run(input, output).await,
			Command::Rembg(cmd) => cmd.run(input, output).await,
		}
	}
}

#[tokio::main]
async fn main() -> Result<()> {
	let cli: AkashiCli = argh::from_env();

	cli.command.run(&cli.input, &cli.output).await;

	Ok(())
}
