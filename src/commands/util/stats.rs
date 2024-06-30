use sysinfo::{ProcessRefreshKind, RefreshKind};
use typesize::*;

use crate::utils::discord::table;
use crate::utils::markup::ansi::Ansi;
use crate::utils::markup::markdown::Markdown;
use crate::{Context, Data, Error};

/// Get Akashi stats
#[poise::command(prefix_command, track_edits, slash_command, category = "Util")]
pub async fn stats(ctx: Context<'_>) -> Result<(), Error> {
    let data = ctx.data();

    let (cache_mem, process_mem, cpu, uptime, images, version, guild_count) =
        get_system_stats(ctx, data).await?;

    let values: Vec<(String, String)> = vec![
        ("Cache memory usage".fg_green(), cache_mem.fg_cyan()),
        ("Memory usage".fg_green(), process_mem.fg_cyan()),
        ("CPU usage".fg_green(), cpu.fg_cyan()),
        ("Cached images".fg_green(), images.fg_cyan()),
        ("Bot version".fg_green(), version.fg_cyan()),
        ("Guild count (cached)".fg_green(), guild_count.fg_cyan()),
    ];

    let stats = table::key_value(&values);

    ctx.say(format!("{}\n\nWoke up <t:{}:R>", stats.codeblock("ansi"), uptime)).await?;

    Ok(())
}

async fn get_system_stats(
    ctx: Context<'_>,
    data: &Data,
) -> Result<(String, String, String, u64, String, String, String), Error> {
    let mut system_info = data.sysinfo.lock().await;
    refresh_system_info(&mut system_info);

    let cache_mem = format_cache_memory(ctx);
    let process_mem = format_process_memory(&system_info)?;
    let cpu = format_cpu_usage(&system_info)?;
    let uptime = get_process_uptime(&system_info)?;
    let images = format_cached_images(ctx).await;
    let version = get_bot_version();
    let guild_count = format_guild_count(ctx)?;

    Ok((cache_mem, process_mem, cpu, uptime, images, version, guild_count))
}

fn refresh_system_info(system_info: &mut sysinfo::System) {
    system_info.refresh_specifics(
        RefreshKind::new()
            .with_processes(ProcessRefreshKind::new().with_memory().with_cpu().with_disk_usage()),
    );
}

fn format_cache_memory(ctx: Context<'_>) -> String {
    let cache_bytes = ctx.cache().get_size();
    let cache_mb = cache_bytes as f64 / 1024.0 / 1024.0;
    format!("{:.3} Mb", cache_mb)
}

fn format_process_memory(system_info: &sysinfo::System) -> Result<String, Error> {
    let pid = sysinfo::get_current_pid().map_err(|e| Error::from(e.to_string()))?;
    let process = system_info.process(pid).ok_or_else(|| Error::from("Process not found"))?;
    Ok(format!("{} Mb", process.memory() / 1024 / 1024))
}

fn format_cpu_usage(system_info: &sysinfo::System) -> Result<String, Error> {
    let pid = sysinfo::get_current_pid().map_err(|e| Error::from(e.to_string()))?;
    let process = system_info.process(pid).ok_or_else(|| Error::from("Process not found"))?;
    Ok(format!("{:.1}%", process.cpu_usage()))
}

fn format_guild_count(ctx: Context<'_>) -> Result<String, Error> {
    let guild_count = ctx.cache().guild_count();
    Ok(format!("{guild_count}"))
}

fn get_process_uptime(system_info: &sysinfo::System) -> Result<u64, Error> {
    let pid = sysinfo::get_current_pid().map_err(|e| Error::from(e.to_string()))?;
    let process = system_info.process(pid).ok_or_else(|| Error::from("Process not found"))?;
    Ok(process.start_time())
}

async fn format_cached_images(ctx: Context<'_>) -> String {
    let cached_images = ctx.data().cached_images.lock().await;
    let cached_images_cap = cached_images.cap().get();
    format!("{}{}", cached_images.len(), format!("/{}", cached_images_cap).fg_black())
}

fn get_bot_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}
