import { assertNormalFloat } from "../utils/math"

export class Color {
	public r: number
	public g: number
	public b: number
	public a: number

	constructor(r: number, g: number, b: number, a: number = 1.0) {
		assertNormalFloat(r, g, b, a)

		this.r = r
		this.g = g
		this.b = b
		this.a = a
	}

	public toRgbList() {
		return [this.r, this.g, this.b]
	}

	public toRgbaList() {
		return [this.r, this.g, this.b, this.a]
	}

	static fromInt(r: number, g: number, b: number, a: number = 255) {
		return new Color(r / 255.0, g / 255.0, b / 255.0, a / 255.0)
	}

	static random() {
		return new Color(
			Math.random(),
			Math.random(),
			Math.random()
		)
	}

	static randomList(size: number) {
		const colors: Color[] = []

		for (let i = 0; i < size; i++) {
			colors.push(Color.random())
		}

		return colors;
	}
}
