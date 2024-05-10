import { Injectable, StreamableFile } from "@nestjs/common";
import { ImagescriptService } from "../../services/imagescript.service";
import { ImageSource } from "../../lib/types";
import { SharpService } from "../../services/sharp.service";
import { Image } from "imagescript";

@Injectable()
export class ImageService {
	constructor(private _imagescriptService: ImagescriptService) {}

	public async invert(source: ImageSource) {
		const image = await this._imagescriptService.resolve<Image>(source);

		const response = await image.invert().encode();

		return new StreamableFile(response);
	}

	public async speechBalloon(source: ImageSource) {
		const image = await this._imagescriptService.resolve<Image>(source);
		const balloon = await this._imagescriptService.resolve<Image>(
			this.balloonUrl,
		);

		image.fit(image.width, image.height + (balloon.height - 100) * 2);
		image.composite(balloon.resize(image.width, balloon.height - 100), 0, 0);
		image.crop(0, 0, image.width, image.height - balloon.height);

		const response = await image.encode();

		return new StreamableFile(response);
	}

	public async caption(source: ImageSource, text: string) {
		const impactFont = await this._imagescriptService.resolveFont(
			this.impactFont,
		);
		const image = await this._imagescriptService.resolve<Image>(source);
		const balloon = new Image(image.width, 100).fill(0xffffffff);

		const caption = await Image.renderText(impactFont, 30, text, 0x00000ff);

		image.fit(image.width, image.height + balloon.height * 2);
		image.composite(balloon.composite(caption, balloon.width / 4, 25), 0, 0);
		image.crop(0, 0, image.width, image.height - balloon.height);

		const response = await image.encode();

		return new StreamableFile(response);
	}

	private readonly impactFont: string =
		"https://github.com/sophilabs/macgifer/raw/master/static/font/impact.ttf";
	private readonly balloonUrl: string = "https://i.redd.it/z0nqjst12ih61.jpg";
}
