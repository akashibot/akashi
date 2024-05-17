import { Image } from "imagescript";

export interface ImageData {
	img: Image;
	x: number;
	y: number;
	resize?: { w?: number; h?: number };
}

export interface TextData {
	text: string;
	x: number;
	y: number;
	size?: number;
	font?: "impact" | "comic";
}
