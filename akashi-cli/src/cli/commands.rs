use argh::FromArgs;

/// Grayscale an image
#[derive(FromArgs, Debug, PartialEq)]
#[argh(subcommand, name = "grayscale")]
pub(crate) struct GrayscaleCommand {}

/// Invert an image
#[derive(FromArgs, Debug, PartialEq)]
#[argh(subcommand, name = "invert")]
pub(crate) struct InvertCommand {}

/// Speech an image
#[derive(FromArgs, Debug, PartialEq)]
#[argh(subcommand, name = "speech")]
pub(crate) struct SpeechCommand {}

/// Remove an image background
#[derive(FromArgs, Debug, PartialEq)]
#[argh(subcommand, name = "rembg")]
pub(crate) struct RembgCommand {
	/// threshold idk
	#[argh(option, short = 't')]
	threshold: u32,
}
