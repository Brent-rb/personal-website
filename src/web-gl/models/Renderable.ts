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

export class TriangleRenderable extends SimpleRenderable {
	_vertices: number[]
	_colors: number[]
	_shaderVertexLocation!: GLint
	_shaderColorLocation!: GLint
	_shaderVertexBuffer: WebGLBuffer | null = null
	_shaderColorBuffer: WebGLBuffer | null = null

	constructor(
		vertices: number[] = [],
		colors: number[] = []
	) {
		super();

		this._vertices = vertices
		this._colors = colors
	}

	protected _onAttachedToProgram(): void {
		this._shaderVertexLocation = this.getAttribLocation("a_position")
		this._shaderColorLocation = this.getAttribLocation("a_color")
		super.destroy()
		this.init()
	}

	protected _initBuffers(): void {
		this._initVertexBuffer()
		this._initColorBuffer()
	}

	private _initVertexBuffer() {
		this._shaderVertexBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._shaderVertexBuffer)
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(this._vertices),
			this.gl.STATIC_DRAW,
		)
	}

	private _initColorBuffer() {
		this._shaderColorBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._shaderColorBuffer)
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(this._colors),
			this.gl.STATIC_DRAW,
		)
	}

	protected _bindBuffers(): void {
		this._bindVertexBuffer()
		this._bindColorBuffer()
	}

	private _bindVertexBuffer() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._shaderVertexBuffer)
		this.gl.vertexAttribPointer(
			this._shaderVertexLocation,
			2,
			this.gl.FLOAT,
			false,
			0,
			0,
		)
		this.gl.enableVertexAttribArray(this._shaderVertexLocation)
	}

	private _bindColorBuffer() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._shaderColorBuffer)
		this.gl.vertexAttribPointer(
			this._shaderColorLocation,
			3,
			this.gl.FLOAT,
			false,
			0,
			0,
		)
		this.gl.enableVertexAttribArray(this._shaderColorLocation)
	}

	protected _draw(): void {
		this.gl.drawArrays(this.gl.TRIANGLES, 0, this._vertices.length / 2)
	}

	protected _destroy(): void {
		if (this._shaderColorBuffer != null) {
			this.gl.deleteBuffer(this._shaderColorBuffer)
			this._shaderColorBuffer = null
		}
		if (this._shaderVertexBuffer != null) {
			this.gl.deleteBuffer(this._shaderVertexBuffer)
			this._shaderVertexBuffer = null
		}
	}
}