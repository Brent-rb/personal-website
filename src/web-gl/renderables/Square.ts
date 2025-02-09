import { Vec2 } from "../models/Vec"
import { Color } from "../models/Color"
import { TriangleEboRenderable } from "./TriangleEboRenderable"
export class Square extends TriangleEboRenderable {
	constructor(
		position: Vec2,
		radius: number,
		colors: Color[]
	) {
		super()
		this.vertices = [
			position.x - radius, position.y + radius, // Top-left
			position.x + radius, position.y + radius, // Top-right
			position.x - radius, position.y - radius, // Bottom-left
			position.x + radius, position.y - radius, // Bottom-right
		]

		this.indices = [
			0, 1, 2,
			1, 2, 3
		]

		this.colors = colors.flatMap(color => color.toRgbList())
	}
}
