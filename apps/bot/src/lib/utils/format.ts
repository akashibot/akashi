import { ImageMeta } from "image-meta";
import { CommandContext } from "seyfert";

export function formatBytes(bytes: number): string {
	const units = ["B", "KB", "MB", "GB", "TB"];
	let i = 0;
	let value = bytes;

	while (value >= 1024 && i < units.length - 1) {
		value /= 1024;
		i++;
	}

	return `${value.toFixed(2)} ${units[i]}`;
}

export function formatUptime(seconds: number): string {
	const days = Math.floor(seconds / (24 * 60 * 60));
	seconds %= 24 * 60 * 60;
	const hours = Math.floor(seconds / (60 * 60));
	seconds %= 60 * 60;
	const minutes = Math.floor(seconds / 60);
	seconds %= 60;

	return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export function formatError(error: unknown, message?: string) {
	return `❌ ${
		error instanceof Error ? error.message : `${message ?? "Error"}: ${error}`
	}`;
}

export function cn(...args: (string | number | boolean | unknown)[]): string {
	return args.filter(Boolean).join(" ");
}

export function cnl(...args: (string | number | boolean | unknown)[]): string {
	return args.filter(Boolean).join("\n");
}

export function cnc(
	separator: string,
	...args: (string | number | boolean | unknown)[]
): string {
	return args.filter(Boolean).join(separator);
}

export function fileName(ctx: CommandContext, type?: ImageMeta["type"]) {
	return cnc(".", ctx.command.name, type ?? "png");
}
