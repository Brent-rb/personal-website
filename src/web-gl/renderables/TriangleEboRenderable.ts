import { SimpleRenderable } from "../models/Renderable"

export class TriangleEboRenderable extends SimpleRenderable {
	protected vertices: number[]
	protected indices: number[]
	protected colors: number[]

	private positionLocation!: GLint
	private colorLocation!: GLint
	private vertexBuffer: WebGLBuffer | null = null
	private indicesBuffer: WebGLBuffer | null = null
	private colorBuffer: WebGLBuffer | null = null

	constructor(
		vertices: number[] = [],
		indices: number[] = [],
		colors: number[] = []
	) {
		super();

		this.vertices = vertices
		this.indices = indices
		this.colors = colors
	}

	protected _onAttachedToProgram(): void {
		this.positionLocation = this.getAttribLocation("a_position")
		this.colorLocation = this.getAttribLocation("a_color")
		super.destroy()
		this.init()
	}

	protected _initBuffers(): void {
		this._initVertexBuffer()
		this._initIndicesBuffer()
		this._initColorBuffer()
	}

	private _initVertexBuffer() {
		this.vertexBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(this.vertices),
			this.gl.STATIC_DRAW,
		)
	}

	private _initIndicesBuffer() {
		this.indicesBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
		this.gl.bufferData(
			this.gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(this.indices),
			this.gl.STATIC_DRAW
		)
	}

	private _initColorBuffer() {
		this.colorBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer)
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(this.colors),
			this.gl.STATIC_DRAW,
		)
	}

	protected _bindBuffers(): void {
		this.bindVertices()
		this.bindColors()
		this.bindIndices()
	}

	private bindVertices() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
		this.gl.vertexAttribPointer(
			this.positionLocation,
			2,
			this.gl.FLOAT,
			false,
			0,
			0,
		)
		this.gl.enableVertexAttribArray(this.positionLocation)
	}

	private bindIndices() {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer)
	}

	private bindColors() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer)
		this.gl.vertexAttribPointer(
			this.colorLocation,
			3,
			this.gl.FLOAT,
			false,
			0,
			0,
		)
		this.gl.enableVertexAttribArray(this.colorLocation)
	}

	protected _draw(): void {
		this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0)
	}

	protected _destroy(): void {
		if (this.colorBuffer != null) {
			this.gl.deleteBuffer(this.colorBuffer)
			this.colorBuffer = null
		}
		if (this.vertexBuffer != null) {
			this.gl.deleteBuffer(this.vertexBuffer)
			this.vertexBuffer = null
		}
	}
}