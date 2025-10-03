export abstract class HttpException extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class InvalidInputException extends HttpException {
  constructor(message = 'Invalid input') {
    super(422, message);
  }
}

export class GenericHttpException extends HttpException {
  constructor(status = 500, message = 'Unexpected error') {
    super(status, message);
  }
}
