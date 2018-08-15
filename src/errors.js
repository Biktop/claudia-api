const CODE_UNKNOWN = 'uknown';

export class StatusError extends Error {
  constructor(status = 500, code = CODE_UNKNOWN, message = '') {
    super(message);

    this.name = 'StatusError';
    Error.captureStackTrace(this, StatusError)

    this.status = status || 500;
    this.code = code || '';
  }
}

export class BadRequestError extends StatusError {
  constructor(code, message) {
    super(400, code, message);

    this.name = 'BadRequestError';
    Error.captureStackTrace(this, BadRequestError)
  }
}

export class UnauthorizedError extends StatusError {
  constructor(code, message) {
    super(401, code, message);

    this.name = 'UnauthorizedError';
    Error.captureStackTrace(this, UnauthorizedError)
  }
}

export class ForbiddenError extends StatusError {
  constructor(code, message) {
    super(403, code, message);

    this.name = 'ForbiddenError';
    Error.captureStackTrace(this, ForbiddenError)
  }
}