import { Injectable } from "@nestjs/common";
import * as sharp from "sharp";
import { ImageSource } from "../lib/types";
import { decode } from "imagescript";

@Injectable()
export class SharpService {
	public async resolveImageFromUrl(url: string) {
		return fetch(url)
			.then((i) => i.arrayBuffer())
			.then((a) => sharp(a));
	}

	public async resolveImageFromBuffer(buffer: Buffer) {
		return sharp(buffer);
	}

	public async resolveImage(source: ImageSource) {
		if (typeof source === "string") {
			return this.resolveImageFromUrl(source);
		}

		return this.resolveImageFromBuffer(source);
	}

	public async imagescriptDecodeWebp(buffer: Buffer) {
		return decode(
			await (await this.resolveImageFromBuffer(buffer)).png().toBuffer(),
		);
	}
}
