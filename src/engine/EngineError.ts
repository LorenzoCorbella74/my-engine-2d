export class EngineError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EngineError';
    }
}