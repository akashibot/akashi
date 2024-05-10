import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageController } from "./image.controller";
import { ImagescriptService } from "../../services/imagescript.service";
import { SharpService } from "../../services/sharp.service";

@Module({
	controllers: [ImageController],
	providers: [ImageService, ImagescriptService, SharpService],
})
export class ImageModule {}
