import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  private reason = "Error connecting to database";
  statusCode = 500;

  constructor() {
    super("Error connecting to database");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors = () => {
    return [
      {
        message: this.reason,
      },
    ];
  };
}
