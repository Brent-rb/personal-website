export abstract class Scene {
    protected canvas: HTMLCanvasElement;
    protected gl: WebGLRenderingContext;

    constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
        this.canvas = canvas;
        this.gl = gl;
    }

    abstract run(): void;
    abstract stop(): void;
    abstract onResize(): void;
}