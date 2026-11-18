export class AppError extends Error {
  public statusCode: number;
  public status: "fail" | "error";
  public isOperational: boolean;
  constructor(message: string, errorCode: number) {
    super(message);
    this.statusCode = errorCode || 500;
    this.status = this.statusCode.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
