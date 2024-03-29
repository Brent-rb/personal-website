let gl = undefined

function randomIntBetween(min, max) {
	const delta = max - min
	return Math.floor(Math.random() * delta) + min
}

function randomColor() {
	return [Math.random(), Math.random(), Math.random()]
}

function randomColorArray(size) {
	let colors = []

	for (let i = 0; i < size; i++) {
		colors.push(...randomColor())
	}

	return colors
}

function reverseColorArray(colors) {
	let chunks = []
	for (let i = 0; i < colors.length / 3; i++) {
		const startIndex = i * 3
		chunks.push([
			colors[startIndex],
			colors[startIndex + 1],
			colors[startIndex + 2]
		])
	}

	const reversed = chunks.reverse()
	return reversed.flat()
}

function randomSquareArray(radiusMin, radiusMax) {
	const radius = randomIntBetween(radiusMin, radiusMax)
	const centerX = randomIntBetween(radius, gl.canvas.width - radius)
	const centerY = randomIntBetween(radius, gl.canvas.height - radius)
	return [
		centerX - radius,
		centerY + radius,
		centerX + radius,
		centerY + radius,
		centerX - radius,
		centerY - radius,
		centerX - radius,
		centerY - radius,
		centerX + radius,
		centerY + radius,
		centerX + radius,
		centerY - radius
	]
}

function fetchScript(path) {
	const request = new XMLHttpRequest()
	request.open('GET', path, false)
	request.send(null)

	if (request.status !== 200) {
		throw new Error('[FetchScript][get-request-failed]')
	}

	return request.responseText
}

class GlUtils {
	static create(canvasId) {
		this._canvasId = canvasId
		const canvas = document.querySelector(`#${this._canvasId}`)
		if (!canvas) {
			throw new Error(
				`[GlUtils][canvas-not-found] Couldn't find canvas #${this._canvasId}`
			)
		}

		gl = canvas.getContext('webgl')
		if (!gl) {
			throw new Error(
				`[GlUtils][gl-unavailable] Unable to initialize WebGL. The browser probably doesn't support it.`
			)
		}

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
		// Clear the canvas
		gl.clearColor(0.1, 0.1, 0.1, 1.0)
		gl.clear(gl.COLOR_BUFFER_BIT)
	}
}

class ScriptShader {
	_shaderPath = undefined
	_shaderType = undefined
	_shaderSource = undefined
	_glShader = undefined
	_glError = undefined

	constructor(scriptId, type) {
		this._shaderPath = scriptId
		this._shaderType = type
	}

	_loadSource() {
		if (!!this._shaderSource) {
			return
		}

		this._shaderSource = fetchScript(this._shaderPath)
		if (!this._shaderSource) {
			throw new Error(
				`[ScriptShader][load-source-error][${this._shaderPath}]`
			)
		}
	}

	_compile() {
		if (!!this._glShader) {
			return
		}

		const shader = gl.createShader(this._shaderType)
		gl.shaderSource(shader, this._shaderSource)
		gl.compileShader(shader)

		const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
		if (success) {
			console.log(`[ScriptShader][compile-success][${this._shaderPath}]`)
			this._glShader = shader
			return
		}

		this._glError = gl.getShaderInfoLog(shader)
		this.destroy()
		throw new Error(`[ScriptShader][compile-error] ${this._glError}`)
	}

	create() {
		this._loadSource()
		this._compile()
	}

	destroy() {
		if (!this._glShader) {
			return
		}

		gl.deleteShader(this._glShader)
		this._glShader = undefined
	}
}

class ShaderProgram {
	_glProgram = undefined
	_shaders = undefined

	constructor(...shaders) {
		this._shaders = shaders
	}

	create() {
		if (!!this._glProgram) {
			return
		}

		this._glProgram = gl.createProgram()

		for (let shader of this._shaders) {
			shader.create()
			gl.attachShader(this._glProgram, shader._glShader)
		}
		gl.linkProgram(this._glProgram)

		const success = gl.getProgramParameter(this._glProgram, gl.LINK_STATUS)
		if (success) {
			console.log(`[ShaderProgram][program-created]`)
			return
		}

		const error = gl.getProgramInfoLog(this._glProgram)
		this.destroy()

		throw new Error(`[ShaderProgram][program-create-error] ${error}`)
	}

	use() {
		gl.useProgram(this._glProgram)
	}

	destroy() {
		gl.deleteProgram(this._glProgram)
		this._program = undefined
	}

	getAttribLocation(name) {
		return gl.getAttribLocation(this._glProgram, name)
	}

	getUniformLocation(name) {
		return gl.getUniformLocation(this._glProgram, name)
	}

	setUniform2f(location, x, y) {
		gl.uniform2f(location, x, y)
	}
}

class Square {
	_vertices = undefined
	_colors = undefined
	_shaderVertexLocation = undefined
	_shaderColorLocation = undefined
	_shaderVertexBuffer = undefined
	_shaderColorBuffer = undefined

	constructor(vertices, colors, vertexLocation, colorLocation) {
		this._vertices = vertices
		this._colors = colors
		this._shaderVertexLocation = vertexLocation
		this._shaderColorLocation = colorLocation
		this._init()
	}

	_init() {
		this._shaderVertexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this._shaderVertexBuffer)
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(this._vertices),
			gl.STATIC_DRAW
		)

		this._shaderColorBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this._shaderColorBuffer)
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(this._colors),
			gl.STATIC_DRAW
		)
	}

	render() {
		gl.bindBuffer(gl.ARRAY_BUFFER, this._shaderVertexBuffer)
		gl.vertexAttribPointer(
			this._shaderVertexLocation,
			2,
			gl.FLOAT,
			false,
			0,
			0
		)

		gl.bindBuffer(gl.ARRAY_BUFFER, this._shaderColorBuffer)
		gl.vertexAttribPointer(
			this._shaderColorLocation,
			3,
			gl.FLOAT,
			false,
			0,
			0
		)

		gl.drawArrays(gl.TRIANGLES, 0, this._vertices.length / 2)
	}
}

class HelloWorld {
	_program = undefined
	_squares = undefined
	_resolutionLocation = undefined

	_createGl() {
		GlUtils.create('hello_world')
	}

	_createProgram() {
		this._program = new ShaderProgram(
			new ScriptShader(
				'/shaders/hello_world/vertex.glsl',
				gl.VERTEX_SHADER
			),
			(this._fragmentShader = new ScriptShader(
				'/shaders/hello_world/fragment.glsl',
				gl.FRAGMENT_SHADER
			))
		)
		this._program.create()
		this._program.use()
		this._resolutionLocation =
			this._program.getUniformLocation('u_resolution')
		if (!this._resolutionLocation) {
			console.warn('[HelloWorld][resolution-uniform-not-found]')
		}
		this._program.setUniform2f(
			this._resolutionLocation,
			gl.canvas.width,
			gl.canvas.height
		)
	}

	_initData() {
		const positionLocation = this._program.getAttribLocation('a_position')
		const colorLocation = this._program.getAttribLocation('a_color')
		gl.enableVertexAttribArray(positionLocation)
		gl.enableVertexAttribArray(colorLocation)
		this._squares = []

		for (let i = 0; i < 2000; i++) {
			const colors = randomColorArray(3)
			this._squares.push(
				new Square(
					randomSquareArray(15, 50),
					[...colors, ...reverseColorArray(colors)],
					positionLocation,
					colorLocation
				)
			)
		}
	}

	_render() {
		const start = new Date().getTime()
		for (let i = 0; i < this._squares.length; i++) {
			this._squares[i].render()
		}
		const end = new Date().getTime()
		console.log(`[HelloWorld][render:${end - start}ms]`)
	}

	run() {
		this._createGl()
		this._createProgram()
		this._initData()
		this._render()
	}

	stop() {
		this._program.destroy()
	}
}

function main() {
	const helloWorld = new HelloWorld()
	try {
		helloWorld.run()
	} catch (error) {
		console.error(error)
		helloWorld.stop()
	}
}

main()
