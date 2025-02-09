export function getGlErrorString(gl: WebGL2RenderingContext) {
	const error = gl.getError()

	switch (error) {
		case gl.NO_ERROR:
			return undefined
		case gl.INVALID_ENUM:
			return "GlError: Invalid Enum"
		case gl.INVALID_VALUE:
			return "GlError: Invalid Value"
		case gl.INVALID_OPERATION:
			return "GlError: Invalid Operation"
		case gl.INVALID_FRAMEBUFFER_OPERATION:
			return "GlError: Invalid FrameBuffer Operation"
		case gl.OUT_OF_MEMORY:
			return "GlError: Out of Memory"
		case gl.CONTEXT_LOST_WEBGL:
			return "GlError: Lost WebGL Context"
		default:
			return `GlError: Unknown Error, Code: ${error}`
	}
}
