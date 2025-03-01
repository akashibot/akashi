use akashi_shared::{AkashiContext, AkashiResult};
use akashi_strings::discord::ansi::Ansi;
use akashi_strings::discord::markdown::Markdown;
use sysinfo::System;

/// Show Akashi stats
#[poise::command(slash_command, prefix_command)]
pub async fn stats(ctx: AkashiContext<'_>) -> AkashiResult {
	let uptime = ctx.data().uptime.clone().elapsed();

	let div_mod = |a, b| (a / b, a % b);

	let seconds = uptime.as_secs();
	let (minutes, seconds) = div_mod(seconds, 60);
	let (hours, minutes) = div_mod(minutes, 60);
	let (days, hours) = div_mod(hours, 24);

	let (memory_usage, cpu_usage) = get_process_usage().unwrap_or((0, 0.0));

	let memory = match memory_usage / 1024 / 1024 {
		0..=100 => (memory_usage / 1024 / 1024).fg_green(),
		101..=500 => (memory_usage / 1024 / 1024).fg_yellow(),
		_ => (memory_usage / 1024 / 1024).fg_red(),
	};

	let cpu = match cpu_usage {
		0.0..=50.0 => format!("{cpu_usage}%").fg_green(),
		51.0..=80.0 => format!("{cpu_usage}%").fg_yellow(),
		_ => format!("{cpu_usage}%").fg_red(),
	};

	ctx.reply(
		format!(
			"Uptime: {} days, {} hours, {} minutes, {} seconds\nMemory usage: {} MB\nCPU usage: {}",
			days.fg_blue(),
			hours.fg_blue(),
			minutes.fg_blue(),
			seconds.fg_blue(),
			memory,
			cpu
		)
		.codeblock("ansi"),
	)
	.await?;

	Ok(())
}

fn get_process_usage() -> Option<(u64, f32)> {
	let mut sys = System::new_all();
	sys.refresh_all();

	let current_pid = sysinfo::get_current_pid().ok()?;

	let memory_usage = {
		let process = sys.process(current_pid)?;
		process.memory()
	};

	sys.refresh_cpu_all();

	let cpu_usage_percent = {
		let process = sys.process(current_pid)?;
		process.cpu_usage()
	};

	Some((memory_usage, cpu_usage_percent))
}
