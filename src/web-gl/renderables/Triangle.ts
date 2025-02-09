import { TriangleRenderable } from "./TriangleRenderable"
import { Vec2 } from "../models/Vec"
import { Color } from "../models/Color"
import { InvalidDataError } from "../errors/InvalidData"

export class Triangle extends TriangleRenderable {
	constructor(points: Vec2[], colors: Color[]) {
		super()

		if (points.length !== 3 || colors.length !== 3) {
			throw new InvalidDataError(
				`points or colors must contain 3 items`,
				null
			)
		}

		this._vertices = points.flatMap((point) => [point.x, point.y])
		this._colors = colors.flatMap((color) => color.toRgbList())
	}
}
