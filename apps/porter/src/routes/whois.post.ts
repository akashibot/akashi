import { Whois } from "~/types/whois";

enum WhoisType {
	live = "live",
	historical = "historical",
	reverse = "reverse",
}

interface WhoisBody {
	whois: WhoisType;
	domainName: string;
}

function isValidWhoisType(value: string): value is WhoisBody["whois"] {
	return Object.keys(WhoisType)
		.filter((key) => Number.isNaN(Number(key)))
		.includes(value);
}

export default eventHandler(async (event) => {
	const body = await readBody<WhoisBody>(event);

	if (!isValidWhoisType(body.whois)) {
		throw new Error(`Invalid whois type: ${body.whois}`);
	}

	const whois = await $fetch<Whois>("https://api.whoisfreaks.com/v1.0/whois", {
		query: {
			apiKey: process.env.WHOIS_APIKEY,
			...body,
		},
		responseType: "json",
	});

	return whois;
});
