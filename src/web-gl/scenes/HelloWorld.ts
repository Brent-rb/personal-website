import { Scene } from "../models/Scene"
import { HelloWorldProgram } from "../programs/HelloWorldProgram"

export class HelloWorldScene extends Scene {
	private program: HelloWorldProgram

	constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
		super(canvas, gl)
		this.program = new HelloWorldProgram(gl)
	}

	run(): void {
		this.program.run()
	}

	stop(): void {
		this.program.destroy()
	}

	onResize(): void {
		this.program.run()
	}
}
