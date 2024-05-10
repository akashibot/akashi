import { Module } from "@nestjs/common";
import { ImageModule } from "./modules/image/image.module";

@Module({
	imports: [ImageModule],
})
export class AppModule {}
