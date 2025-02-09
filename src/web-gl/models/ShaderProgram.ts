import { InvalidDataError } from "../errors/InvalidData"
import { Shader } from "./Shader"
import { WebGlLog } from "./WebGlLog"

export class ShaderProgram {
	public shaders: Shader[] = []

	private _glProgram: WebGLProgram | null = null
	private _attribLocations = new Map<string, GLint>()
	private _uniformLocations = new Map<string, WebGLUniformLocation>()

	constructor(protected gl: WebGL2RenderingContext, ...shaders: Shader[]) {
		this.shaders = shaders
	}

	public getGl() {
		return this.gl;
	}

	public load() {
		if (this._glProgram) {
			return
		}

		this._glProgram = this.gl.createProgram()

		for (const shader of this.shaders) {
			shader.create()
			this.gl.attachShader(this._glProgram, shader._glShader!)
		}
		this.gl.linkProgram(this._glProgram)

		const success = this.gl.getProgramParameter(this._glProgram, this.gl.LINK_STATUS)
		if (!success) {
			const error = this.gl.getProgramInfoLog(this._glProgram)
			this.destroy()

			WebGlLog.error(error ?? 'Unknown error')
			throw new Error(`[ShaderProgram][program-create-error] ${error}`)
		}

		WebGlLog.info(`program created`)
	}

	public use() {
		this.gl.useProgram(this._glProgram)
	}

	public destroy() {
		this.gl.deleteProgram(this._glProgram)
		this._glProgram = null
	}

	public getAttribLocation(name: string): GLint {
		if (!this._attribLocations.has(name)) {
			this._attribLocations.set(name, this.gl.getAttribLocation(this.getGlProgramAssert(), name))
		}

		return this._attribLocations.get(name)!
	}

	public getUniformLocation(name: string) {
		if (!this._uniformLocations.has(name)) {
			const uniformLocation = this.gl.getUniformLocation(this.getGlProgramAssert(), name)
			if (!uniformLocation) {
				throw new InvalidDataError(`uniform location ${name}`, uniformLocation)
			}

			this._uniformLocations.set(name, uniformLocation)
		}

		return this._uniformLocations.get(name)!
	}

	public setUniform2f(location: WebGLUniformLocation, x: number, y: number) {
		this.gl.uniform2f(location, x, y)
	}

	private getGlProgramAssert() {
		if (!this._glProgram) {
			throw new InvalidDataError("gl program", this._glProgram)
		}

		return this._glProgram
	}
}
