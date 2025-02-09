import { InvalidDataError } from "../../errors/InvalidData"
import { Square } from "../../models/Renderables/Square"
import { Scene } from "../../models/Scene"
import { ScriptShader } from "../../models/ScriptShader"
import { ShaderProgram } from "../../models/ShaderProgram"
import { randomColorArray, randomSquareArray } from "../../utils/random"

import vertexShader from "./shaders/vertex.glsl?raw"
import fragmentShader from "./shaders/fragment.glsl?raw"

function reverseColorArray(colors: number[]) {
	const chunks = []
	for (let i = 0; i < colors.length / 3; i++) {
		const startIndex = i * 3
		chunks.push([
			colors[startIndex],
			colors[startIndex + 1],
			colors[startIndex + 2],
		])
	}

	const reversed = chunks.reverse()
	return reversed.flat()
}

export class HelloWorld extends Scene {
	_program?: ShaderProgram = undefined
	_squares: Square[] = []
	_resolutionLocation: WebGLUniformLocation | null = null
	_fragmentShader?: ScriptShader

	_createProgram() {
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

		this._program = new ShaderProgram(
			this.gl,
			new ScriptShader(
				this.gl,
				this.gl.VERTEX_SHADER,
				vertexShader,
				"hello-world-vertex"
			),
			new ScriptShader(
				this.gl,
				this.gl.FRAGMENT_SHADER,
				fragmentShader,
				"hello-world-fragment"
			)
		)
		this._program.create()
		this._program.use()
		this._resolutionLocation =
			this._program.getUniformLocation("u_resolution")
		if (!this._resolutionLocation) {
			console.warn("[HelloWorld][resolution-uniform-not-found]")
		}
		console.log(`[Scene] ${this.gl.canvas.width}x${this.gl.canvas.height}`)
		this._program.setUniform2f(
			this._resolutionLocation!,
			this.gl.canvas.width,
			this.gl.canvas.height
		)
	}

	_initData() {
		if (!this._program) {
			throw new InvalidDataError("program", this._program);
		}

		const positionLocation = this._program.getAttribLocation("a_position")
		const colorLocation = this._program.getAttribLocation("a_color")
		this.gl.enableVertexAttribArray(positionLocation)
		this.gl.enableVertexAttribArray(colorLocation)
		this._squares = []

		for (let i = 0; i < 2000; i++) {
			const colors = randomColorArray(3)
			this._squares.push(
				new Square(
					this.gl,
					randomSquareArray(15, 50, this.canvas.width, this.canvas.height),
					[...colors, ...reverseColorArray(colors)],
					positionLocation,
					colorLocation
				)
			)
		}
	}

	_render() {
		const start = new Date().getTime()
		for (let i = 0; i < this._squares.length; i++) {
			this._squares[i].render()
		}
		const end = new Date().getTime()
		console.log(`[HelloWorld][render:${end - start}ms]`)
	}

	run() {
		this._createProgram()
		this._initData()
		this._render()
	}

	stop() {
		this._program?.destroy()
	}

	onResize(): void {
		this.stop();
		this.run();
	}
}