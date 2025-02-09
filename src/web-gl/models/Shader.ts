import { ShaderCreationError } from "../errors/ShaderCreation"
import { getGlErrorString } from "../utils/gl"
import { WebGlLog } from "./WebGlLog"

export class Shader {
	private name?: string
	private type: number
	private source: string
	public glShader: WebGLShader | null = null

	constructor(protected gl: WebGL2RenderingContext, type: number, source: string, name?: string) {
		this.source = source
		this.type = type
		this.name = name;
	}

	create() {
		this.loadSource()
		this.compile()
	}

	destroy() {
		if (!this.glShader) {
			return
		}

		this.gl.deleteShader(this.glShader)
		this.glShader = null
	}

	private loadSource() {
		if (this.source) {
			return
		}

		if (!this.source) {
			throw new Error(
				`[ScriptShader][load-source-error][${this.name}]`,
			)
		}
	}

	private compile() {
		if (this.glShader) {
			return
		}

		const shader = this.gl.createShader(this.type)
		if (!shader) {
			throw new ShaderCreationError(getGlErrorString(this.gl) ?? "Unknown")
		}

		this.gl.shaderSource(shader, this.source)
		this.gl.compileShader(shader)

		const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)
		if (!success) {
			const error = this.gl.getShaderInfoLog(shader)
			throw new ShaderCreationError(error ?? "Unknown");
		}

		WebGlLog.info(`${this.name} compiled`)
		this.glShader = shader;
	}
}
