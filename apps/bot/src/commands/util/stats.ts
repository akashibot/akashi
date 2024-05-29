import { cnl, formatBytes, formatUptime } from "@/lib/utils/format";
import { type CommandContext, Declare, SubCommand } from "seyfert";

@Declare({
	name: "stats",
	description: "Display Akashi stats",
})
export default class UtilStatsCommand extends SubCommand {
	public async run(ctx: CommandContext) {
		const memoryUsageStats = this.getMemoryUsageStats();

		return await ctx.editOrReply({
			content: cnl(
				`RSS: ${memoryUsageStats.rss}`,
				`Heap Total: ${memoryUsageStats.heapTotal}`,
				`Heap Used: ${memoryUsageStats.heapUsed}`,
				`External: ${memoryUsageStats.external}`,
				`ArrayBuffers: ${memoryUsageStats.arrayBuffers}`,
				`Uptime: ${formatUptime(Math.floor(process.uptime()))}`,
			),
		});
	}

	public getMemoryUsageStats(): MemoryUsageStats {
		const memoryUsage = process.memoryUsage();

		return {
			rss: formatBytes(memoryUsage.rss),
			heapTotal: formatBytes(memoryUsage.heapTotal),
			heapUsed: formatBytes(memoryUsage.heapUsed),
			external: formatBytes(memoryUsage.external),
			arrayBuffers: formatBytes(memoryUsage.arrayBuffers),
		};
	}
}

interface MemoryUsageStats {
	rss: string;
	heapTotal: string;
	heapUsed: string;
	external: string;
	arrayBuffers: string;
}
