import { Renderable } from "./Renderable"
import { ShaderProgram } from "./ShaderProgram"
import { WebGlLog } from "./WebGlLog"

export abstract class Program {
	protected shaderProgram: ShaderProgram
	protected renderables: Renderable[] = []

	constructor(protected gl: WebGL2RenderingContext, shaderProgram: ShaderProgram) {
		this.shaderProgram = shaderProgram
	}

	public addRenderable(renderable: Renderable) {
		this.renderables.push(renderable)
		renderable.attach(
			this.shaderProgram.getGl(),
			(name) => this.shaderProgram.getAttribLocation(name),
			(name) => this.shaderProgram.getUniformLocation(name)
		)
	}

	public removeRenderable(renderable: Renderable) {
		const index = this.renderables.findIndex(
			(value) => value.id === renderable.id
		)
		this.renderables.splice(index, 1)
	}

	public render() {
		const startTime = Date.now()
		const gl = this.shaderProgram.getGl()
		gl.clearColor(1.0, 1.0, 1.0, 1.0)
		this.shaderProgram.use()
		for (const renderable of this.renderables) {
			renderable.render()
		}
		const endTime = Date.now()
		const ms = endTime - startTime
		WebGlLog.info(`render took ${ms}ms`)
	}

	public clearRenderables() {
		const renderables = this.renderables;
		this.renderables = [];
		return renderables;
	}
}
