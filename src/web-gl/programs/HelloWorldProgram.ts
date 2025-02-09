import { Program } from "../models/Program"

import vertexShader from "../shaders/hello-world-vertex.glsl?raw"
import fragmentShader from "../shaders/hello-world-fragment.glsl?raw"
import { Color } from "../models/Color"
import { ShaderProgram } from "../models/ShaderProgram"
import { Shader } from "../models/Shader"
import { Square } from "../renderables/Square"
import { Vec2 } from "../models/Vec"
import { randomIntBetween } from "../utils/random"
import { Triangle } from "../renderables/Triangle"

export class HelloWorldProgram extends Program {
	private uResolution!: WebGLUniformLocation
	private uRed!: WebGLUniformLocation
	private uOffset!: WebGLUniformLocation
	
	constructor(gl: WebGL2RenderingContext) {
		super(
			gl,
			new ShaderProgram(
				gl,
				new Shader(
					gl,
					gl.VERTEX_SHADER,
					vertexShader,
					"hello-world-vertex"
				),
				new Shader(
					gl,
					gl.FRAGMENT_SHADER,
					fragmentShader,
					"hello-world-fragment"
				)
			)
		)

		this.shaderProgram.load()
		this.shaderProgram.use()
		this.uResolution = this.shaderProgram.getUniformLocation("u_resolution")
		this.uRed = this.shaderProgram.getUniformLocation("u_red")
		this.uOffset = this.shaderProgram.getUniformLocation("u_offset")
	}

	private init() {
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
		this.gl.clearColor(1/5, 1/5, 1/5, 1.0)

		this.shaderProgram.setUniform2f(
			this.uResolution!,
			this.gl.canvas.width,
			this.gl.canvas.height
		)
	}

	private createRenderables() {
		this.destroyRenderables()
		this.createTriangles()
		this.createSquares()
	}

	private createTriangles() {
		for (let i = 0; i < 100; i++) {
			const colors = Color.randomList(3)
			const size = randomIntBetween(5, 50)
			const location = Vec2.random(new Vec2(), new Vec2(this.gl.canvas.width, this.gl.canvas.height))
			this.addRenderable(new Triangle(
				[new Vec2(location.x - size, location.y), new Vec2(location.x, location.y + size), new Vec2(location.x + size, location.y)],
				colors
			))
		}
	}

	private createSquares() {
		for (let i = 0; i < 100; i++) {
			const colors = Color.randomList(3)
			const mirroredColors = [...colors, colors[0]]
			this.addRenderable(new Square(
				Vec2.random(new Vec2(), new Vec2(this.gl.canvas.width, this.gl.canvas.height)),
				randomIntBetween(15, 50),
				mirroredColors
			))
		}
	}

	load() {
		this.init()
		this.createRenderables();
	}

	public render(): void {
		this.shaderProgram.setUniform2f(this.uOffset, Math.sin(Date.now() / 1289) / 10, Math.cos(Date.now() / 3512) / 10)
		this.shaderProgram.setUniform1f(this.uRed, Math.sin(Date.now() / 1000))
		super.render()
	}

	destroyRenderables() {
		const renderables = this.clearRenderables()
		for (const renderable of renderables) {
			renderable.destroy()
		}
	}

	destroy() {
		this.destroyRenderables()
		this.shaderProgram.destroy()
	}
}
