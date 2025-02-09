import { randomIntBetween } from "../utils/random";

export class Vec2 {
	constructor(public x: number = 0, public y: number = 0) {}

	static random(min: Vec2, max: Vec2) {
		return new Vec2(
			randomIntBetween(min.x, max.x),
			randomIntBetween(min.y, max.y)
		)
	}
}

export class Vec3 {
	constructor(public x: number, public y: number, public z: number) {}
}
