export abstract class Scene {
	protected canvas: HTMLCanvasElement
	protected gl: WebGL2RenderingContext

	constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
		this.canvas = canvas
		this.gl = gl
	}

	abstract run(): void
	abstract stop(): void

	abstract onResize(): void
}
