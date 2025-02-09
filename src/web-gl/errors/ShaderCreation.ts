export class ShaderCreationError extends Error {
    constructor(reason: string) {
        super(`Failed to create shader, reason: ${reason}`)
    }
}