import { Declare, Command, AutoLoad } from "seyfert";

@Declare({
	name: "image",
	description: "Image commands parent",
})
@AutoLoad()
export default class ImageParent extends Command {}
