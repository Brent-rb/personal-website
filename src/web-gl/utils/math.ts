import { InvalidDataError } from "../errors/InvalidData"

export function assertClamp(value: number, min: number, max: number) {
	if (value < min || value > max) {
		throw new InvalidDataError(
			`value should be between ${min} and ${max}`,
			value
		)
	}
}

export function assertNormalFloat(...values: number[]) {
	for (const value of values) {
		assertClamp(value, 0 ,1)
	}
}
