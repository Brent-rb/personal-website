export class GlContextInvalidError extends Error {
    constructor() {
        super("GlContext is null")
    }
}