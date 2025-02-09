export class GlModel {
	constructor(protected gl: WebGLRenderingContext) {}

	protected getGlError(): string | undefined {
		const error = this.gl.getError();
		switch (error) {
			case this.gl.NO_ERROR:
				return undefined;
			case this.gl.INVALID_ENUM:
				return "GlError: Invalid Enum";
			case this.gl.INVALID_VALUE:
				return "GlError: Invalid Value";
			case this.gl.INVALID_OPERATION:
				return "GlError: Invalid Operation";
			case this.gl.INVALID_FRAMEBUFFER_OPERATION:
				return "GlError: Invalid FrameBuffer Operation";
			case this.gl.OUT_OF_MEMORY:
				return "GlError: Out of Memory";
			case this.gl.CONTEXT_LOST_WEBGL:
				return "GlError: Lost WebGL Context";
			default:
				return `GlError: Unknown Error, Code: ${error}`
		}
	}
}
