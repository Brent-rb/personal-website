import { Renderable } from "./Renderable"
import { ShaderProgram } from "./ShaderProgram"
import { WebGlLog } from "./WebGlLog"

export abstract class Program {
	protected shaderProgram: ShaderProgram
	protected renderables: Renderable[] = []
	
	private isRendering = false

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
		if (this.isRendering) {
			return;
		}
		this.isRendering = true

		const startTime = window.performance.now() / 1000

		this.shaderProgram.use()
		this.gl.clear(this.gl.COLOR_BUFFER_BIT)
		for (const renderable of this.renderables) {
			renderable.render()
		}

		const endTime = window.performance.now() / 1000
		const ms = (endTime - startTime)
		WebGlLog.renderMs(ms)

		this.isRendering = false
	}

	public clearRenderables() {
		const renderables = this.renderables;
		this.renderables = [];
		return renderables;
	}
}
