use anyhow::{Result, anyhow};
use std::{path::PathBuf, process::Stdio};
use tokio::process::Command;

pub(crate) fn invoke_ffmpeg_command() -> Box<Command> {
	let mut cmd = Box::new(Command::new("ffmpeg"));
	cmd.stderr(Stdio::null()).stdout(Stdio::null());

	cmd
}

pub(crate) async fn get_video_resolution(input: PathBuf) -> Result<(u32, u32)> {
	let output = Command::new("ffprobe")
		.arg("-v")
		.arg("error")
		.arg("-select_streams")
		.arg("v")
		.arg("-show_entries")
		.arg("stream=width,height")
		.arg("-of")
		.arg("csv=p=0:s=x")
		.arg(&input)
		.output()
		.await?;

	let stdout = String::from_utf8_lossy(&output.stdout);
	let resolution = parse_resolution(&stdout.trim())?;

	Ok(resolution)
}

fn parse_resolution(resolution: &str) -> Result<(u32, u32)> {
	let mut parts = resolution.split('x');

	let width = parts
		.next()
		.ok_or_else(|| anyhow!("Missing width in resolution string"))?
		.parse::<u32>()?;

	let height = parts
		.next()
		.ok_or_else(|| anyhow!("Missing height in resolution string"))?
		.parse::<u32>()?;

	if parts.next().is_some() {
		return Err(anyhow!("Invalid resolution format: too many parts"));
	}

	Ok((width, height))
}
