import { InvalidDataError } from "../errors/InvalidData"
import { Shader } from "./Shader"
import { WebGlLog } from "./WebGlLog"

export class ShaderProgram {
	public shaders: Shader[] = []

	private glProgram: WebGLProgram | null = null
	private attribLocation = new Map<string, GLint>()
	private uniformLocations = new Map<string, WebGLUniformLocation>()

	constructor(protected gl: WebGL2RenderingContext, ...shaders: Shader[]) {
		this.shaders = shaders
	}

	public getGl() {
		return this.gl;
	}

	public load() {
		if (this.glProgram) {
			return
		}

		this.glProgram = this.gl.createProgram()

		for (const shader of this.shaders) {
			shader.create()
			this.gl.attachShader(this.glProgram, shader.glShader!)
		}
		this.gl.linkProgram(this.glProgram)

		const success = this.gl.getProgramParameter(this.glProgram, this.gl.LINK_STATUS)
		if (!success) {
			const error = this.gl.getProgramInfoLog(this.glProgram)
			this.destroy()

			WebGlLog.error(error ?? 'Unknown error')
			throw new Error(`[ShaderProgram][program-create-error] ${error}`)
		}

		WebGlLog.info(`program created`)
	}

	public use() {
		this.gl.useProgram(this.glProgram)
	}

	public destroy() {
		this.gl.deleteProgram(this.glProgram)
		this.glProgram = null
	}

	public getAttribLocation(name: string): GLint {
		if (!this.attribLocation.has(name)) {
			this.attribLocation.set(name, this.gl.getAttribLocation(this.getGlProgramAssert(), name))
		}

		return this.attribLocation.get(name)!
	}

	public getUniformLocation(name: string) {
		if (!this.uniformLocations.has(name)) {
			const uniformLocation = this.gl.getUniformLocation(this.getGlProgramAssert(), name)
			if (!uniformLocation) {
				throw new InvalidDataError(`uniform location ${name}`, uniformLocation)
			}

			this.uniformLocations.set(name, uniformLocation)
		}

		return this.uniformLocations.get(name)!
	}

	public setUniform2f(location: WebGLUniformLocation, x: number, y: number) {
		this.gl.uniform2f(location, x, y)
	}

	public setUniform1f(location: WebGLUniformLocation, value: number) {
		this.gl.uniform1f(location, value)
	}

	private getGlProgramAssert() {
		if (!this.glProgram) {
			throw new InvalidDataError("gl program", this.glProgram)
		}

		return this.glProgram
	}
}
