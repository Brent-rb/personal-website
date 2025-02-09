import { v4 as uuidv4 } from 'uuid';

type AttribLocationGetter = (name: string) => GLint
type UniformLocationGetter = (name: string) => WebGLUniformLocation

export abstract class Renderable {
	public id: string
	protected gl!: WebGL2RenderingContext

	protected getAttribLocation!: AttribLocationGetter
	protected getUniformLocation!: UniformLocationGetter

	constructor() {
		this.id = uuidv4()
	}

	public attach(gl: WebGL2RenderingContext, getAttribLocation: AttribLocationGetter, getUniformLocation: UniformLocationGetter) {
		this.gl = gl;
		this.getAttribLocation = getAttribLocation
		this.getUniformLocation = getUniformLocation
		this._onAttachedToProgram()
	}

	protected abstract _onAttachedToProgram(): void;

	public abstract init(): void;
	public abstract destroy(): void;
	public abstract render(): void;
}

export abstract class SimpleRenderable extends Renderable {
	_vaoBuffer: WebGLVertexArrayObject | null = null 

	protected abstract _initBuffers(): void
	protected abstract _bindBuffers(): void
	protected abstract _draw(): void
	protected abstract _destroy(): void

	public init(): void {
		this._initBuffers()

		this._vaoBuffer = this.gl.createVertexArray();
		this.gl.bindVertexArray(this._vaoBuffer)

		this._bindBuffers()

		this.gl.bindVertexArray(null);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
	}

	public destroy(): void {
		this._destroy()

		this.gl.bindVertexArray(null);
		if (this._vaoBuffer !== null) {
			this.gl.deleteVertexArray(this._vaoBuffer)
			this._vaoBuffer = null
		}
	}

	render() {
		this.gl.bindVertexArray(this._vaoBuffer)
		this._draw()
		this.gl.bindVertexArray(null)
	}
}