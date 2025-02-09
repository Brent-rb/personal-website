export abstract class Scene {
	protected canvas: HTMLCanvasElement
	protected gl: WebGL2RenderingContext
	protected loopInterval: number = 0

	constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
		this.canvas = canvas
		this.gl = gl
	}

	abstract start(): void
	abstract render(): void
	abstract stop(): void

	public startRenderLoop() {
		this.stopRenderLoop()
		this.loopInterval = setInterval(() => this.render(), 1000 / 60.0)
	}

	public stopRenderLoop() {
		clearInterval(this.loopInterval)
	}

	abstract onResize(): void
}
