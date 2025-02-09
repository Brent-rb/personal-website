import { SimpleRenderable } from "../models/Renderable"

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