use crate::{
    utils::{markup::{ansi::Ansi, markdown::Markdown}, table}, Context, Error,
};

/// Get Akashi stats
#[poise::command(prefix_command, track_edits, slash_command, category = "util")]
pub async fn stats(ctx: Context<'_>) -> Result<(), Error> {
    let data = ctx.data();

    let (mem, cpu, uptime, disk) = {
        let mut system_info = data.sysinfo.lock().await;
        system_info.refresh_specifics(
            sysinfo::RefreshKind::new()
                .with_processes(sysinfo::ProcessRefreshKind::new().with_memory().with_cpu().with_disk_usage()),
        );

        let pid = sysinfo::get_current_pid().unwrap();
        let process = system_info.process(pid).unwrap();
        let mem = format!("{}MB", process.memory() / 1024 / 1024);
        let cpu = format!("{:.1}%", process.cpu_usage());
        let disk = format!("{}MB", process.disk_usage().total_read_bytes / 1024 / 1024);
        let uptime = process.start_time();

        (mem, cpu, uptime, disk)
    };

    let values: Vec<(String, String)> = vec![
        ("Memory usage".fg_green(), mem.fg_blue()),
        ("CPU usage".fg_green(), cpu.fg_blue()),
        ("Disk usage".fg_green(), disk.fg_blue()),
    ];

    let stats = table::key_value(&values);

    ctx.say(format!("{}\n\nUptime timestamp (Relative): <t:{}:R>", stats.codeblock("ansi"), uptime)).await?;

    Ok(())
}
