export class ApiError extends Error {
    status: number;
    payload: any;

    constructor(status: number, message: string, payload: any = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.payload = payload;

        // Prototype chain correction for custom errors in TypeScript
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    isUnauthorized(): boolean {
        return this.status === 401;
    }
}
