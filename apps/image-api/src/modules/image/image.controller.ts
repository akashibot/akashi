import {
	Body,
	Controller,
	Header,
	Post,
	Res,
	StreamableFile,
} from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageDto } from "./dto/image.dto";

@Controller("image")
export class ImageController {
	constructor(private _imageService: ImageService) {}

	@Post("invert")
	@Header("Content-Type", "image/png")
	public async invert(@Body() body: ImageDto) {
		return this._imageService.invert(body.image);
	}

	@Post("speech-balloon")
	@Header("Content-Type", "image/png")
	public async speechBalloon(@Body() body: ImageDto) {
		return this._imageService.speechBalloon(body.image);
	}

	@Post("caption")
	@Header("Content-Type", "image/png")
	public async caption(@Body() body: ImageDto) {
		return this._imageService.caption(body.image, "CAPTION");
	}
}
