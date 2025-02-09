import { Scene } from "../models/Scene"
import { HelloWorldProgram } from "../programs/HelloWorldProgram"

export class HelloWorldScene extends Scene {
	private program: HelloWorldProgram

	constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
		super(canvas, gl)
		this.program = new HelloWorldProgram(gl)
	}

	start(): void {
		this.program.load()
		this.startRenderLoop()
	}

	render(): void {
		this.program.render()
	}

	stop(): void {
		this.stopRenderLoop()
		this.program.destroy()
	}

	onResize(): void {
		this.program.load()
	}
}
