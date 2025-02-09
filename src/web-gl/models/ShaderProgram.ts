import { InvalidDataError } from "../errors/InvalidData"
import { GlModel } from "./GlModel"
import { ScriptShader } from "./ScriptShader"

export class ShaderProgram extends GlModel {
	public shaders: ScriptShader[] = []

	private _glProgram: WebGLProgram | null = null

	constructor(gl: WebGLRenderingContext, ...shaders: ScriptShader[]) {
		super(gl)
		this.shaders = shaders
	}

	_assertGlProgram() {
		if (!this._glProgram) {
			throw new InvalidDataError("gl program", this._glProgram)
		}

		return this._glProgram
	}

	create() {
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
		if (success) {
			console.log(`[ShaderProgram][program-created]`)
			return
		}

		const error = this.gl.getProgramInfoLog(this._glProgram)
		this.destroy()

		throw new Error(`[ShaderProgram][program-create-error] ${error}`)
	}

	use() {
		this.gl.useProgram(this._glProgram)
	}

	destroy() {
		this.gl.deleteProgram(this._glProgram)
		this._glProgram = null
	}

	getAttribLocation(name: string): GLint {
		return this.gl.getAttribLocation(this._assertGlProgram(), name)
	}

	getUniformLocation(name: string) {
		return this.gl.getUniformLocation(this._assertGlProgram(), name)
	}

	setUniform2f(location: WebGLUniformLocation, x: number, y: number) {
		this.gl.uniform2f(location, x, y)
	}
}
