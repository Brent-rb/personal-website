import { GlModel } from "../GlModel"

export class Square extends GlModel {
	_vertices: number[]
	_colors: number[]
	_shaderVertexLocation: GLint
	_shaderColorLocation: GLint
	_shaderVertexBuffer: WebGLBuffer | null = null
	_shaderColorBuffer: WebGLBuffer | null = null

	constructor(
		gl: WebGLRenderingContext,
		vertices: number[],
		colors: number[],
		vertexLocation: GLint,
		colorLocation: GLint,
	) {
		super(gl)

		this._vertices = vertices
		this._colors = colors
		this._shaderVertexLocation = vertexLocation
		this._shaderColorLocation = colorLocation
		this._init()
	}

	_init() {
		this._shaderVertexBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._shaderVertexBuffer)
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(this._vertices),
			this.gl.STATIC_DRAW,
		)

		this._shaderColorBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._shaderColorBuffer)
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(this._colors),
			this.gl.STATIC_DRAW,
		)
	}

	render() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._shaderVertexBuffer)
		this.gl.vertexAttribPointer(
			this._shaderVertexLocation,
			2,
			this.gl.FLOAT,
			false,
			0,
			0,
		)

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._shaderColorBuffer)
		this.gl.vertexAttribPointer(
			this._shaderColorLocation,
			3,
			this.gl.FLOAT,
			false,
			0,
			0,
		)

		this.gl.drawArrays(this.gl.TRIANGLES, 0, this._vertices.length / 2)
	}
}
