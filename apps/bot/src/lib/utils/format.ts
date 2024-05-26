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

export function formatError(error: unknown, message?: string) {
	return `❌ ${
		error instanceof Error ? error.message : `${message ?? "Error"}: ${error}`
	}`;
}

export function cn(...args: (string | number | boolean | unknown)[]): string {
	return args.filter(Boolean).join(" ");
}
