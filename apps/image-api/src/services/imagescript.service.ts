import { Injectable } from "@nestjs/common";
import { GIF, Image } from "imagescript";
import { ImageSource } from "../lib/types";
import { SharpService } from "./sharp.service";

@Injectable()
export class ImagescriptService {
	constructor(private _sharpService: SharpService) {}

	public async resolveFromUrl<T extends Image | GIF>(url: string): Promise<T> {
		return fetch(url)
			.then((i) => i.arrayBuffer())
			.then(
				(a) =>
					this._sharpService.imagescriptDecodeWebp(
						Buffer.from(a),
					) as unknown as T,
			);
	}

	public async resolveFromBuffer<T extends Image | GIF>(
		buffer: Buffer,
	): Promise<T> {
		return this._sharpService.imagescriptDecodeWebp(
			Buffer.from(buffer),
		) as unknown as T;
	}

	public async resolve<T extends Image | GIF>(
		urlOrBuffer: ImageSource,
	): Promise<T> {
		if (typeof urlOrBuffer === "string") {
			return this.resolveFromUrl<T>(urlOrBuffer);
		}

		return this.resolveFromBuffer<T>(urlOrBuffer);
	}

	public async resolveFont(url: string) {
		return fetch(url)
			.then((i) => i.arrayBuffer())
			.then((a) => new Uint8Array(a));
	}
}
