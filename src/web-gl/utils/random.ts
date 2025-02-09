import { Color } from "../models/SimpleTypes"

export function randomIntBetween(min: number, max: number) {
	const delta = max - min
	return Math.floor(Math.random() * delta) + min
}

export function randomColor(): Color {
	return [Math.random(), Math.random(), Math.random()]
}

export function randomColorArray(size: number) {
	const colors: number[] = []

	for (let i = 0; i < size; i++) {
		colors.push(...randomColor())
	}

	return colors
}

export function randomSquareArray(radiusMin: number, radiusMax: number, canvasWidth: number, canvasHeight: number) {
	const radius = randomIntBetween(radiusMin, radiusMax)
	const centerX = randomIntBetween(0, canvasWidth)
	const centerY = randomIntBetween(0, canvasHeight)
	return [
		centerX - radius,
		centerY + radius,
		centerX + radius,
		centerY + radius,
		centerX - radius,
		centerY - radius,
		centerX - radius,
		centerY - radius,
		centerX + radius,
		centerY + radius,
		centerX + radius,
		centerY - radius,
	]
}
