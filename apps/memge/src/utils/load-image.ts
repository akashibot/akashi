export function loadImage(url: string) {
	return $fetch<ArrayBuffer>(url, { responseType: "arrayBuffer" });
}
