import { IsImageSource } from "../../../lib/validators/is-image-source";

export class ImageDto {
	@IsImageSource({
		message: "Image should be a valid Buffer or URL",
	})
	readonly image!: string;
}
