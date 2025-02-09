import { ShaderCreationError } from "../errors/ShaderCreation"
import { getGlErrorString } from "../utils/gl"
import { WebGlLog } from "./WebGlLog"

export class Shader {
	private _name?: string
	private _type: number
	private _source: string
	public _glShader: WebGLShader | null = null

	constructor(protected gl: WebGL2RenderingContext, type: number, source: string, name?: string) {
		this._source = source
		this._type = type
		this._name = name;
	}

	create() {
		this.loadSource()
		this.compile()
	}

	destroy() {
		if (!this._glShader) {
			return
		}

		this.gl.deleteShader(this._glShader)
		this._glShader = null
	}

	private loadSource() {
		if (this._source) {
			return
		}

		if (!this._source) {
			throw new Error(
				`[ScriptShader][load-source-error][${this._name}]`,
			)
		}
	}

	private compile() {
		if (this._glShader) {
			return
		}

		const shader = this.gl.createShader(this._type)
		if (!shader) {
			throw new ShaderCreationError(getGlErrorString(this.gl) ?? "Unknown")
		}

		this.gl.shaderSource(shader, this._source)
		this.gl.compileShader(shader)

		const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)
		if (!success) {
			const error = this.gl.getShaderInfoLog(shader)
			throw new ShaderCreationError(error ?? "Unknown");
		}

		WebGlLog.info(`${this._name} compiled`)
		this._glShader = shader;
	}
}
