export class InvalidDataError extends Error {
    constructor(dataName: string, data: unknown) {
        super(`Variable ${dataName} is ${data}`)
    }
}