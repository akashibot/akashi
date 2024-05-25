/**
 * Custom command options parser for Akashi.
 * Currently work-in-progress since this shit hard asf
 */
export function parseCommandArgs(input: string) {
	const args = input.trim().split(/\s+/);
	const options: { [key: string]: string } = {};

	let currentOption: string | null = null;

	for (const arg of args) {
		if (arg.startsWith("--")) {
			if (currentOption) {
				// This handles the case where the previous option didn't get a value
				options[currentOption] = "true";
			}
			const [option, value] = arg.substring(2).split("=");
			if (value !== undefined) {
				options[option] = value;
				currentOption = null;
			} else {
				currentOption = option;
			}
		} else {
			if (currentOption) {
				options[currentOption] = arg;
				currentOption = null;
			} else {
				// Treat standalone arguments as options with their names as keys
				options[arg] = arg;
			}
		}
	}

	// Handle the case where the last option didn't get a value
	if (currentOption) {
		options[currentOption] = "true";
	}

	return options;
}
