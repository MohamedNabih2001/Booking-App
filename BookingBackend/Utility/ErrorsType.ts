export const ERROR_MESSAGES = {
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Resource not found",
  CONFLICT: "Conflict",
  TOO_MANY_REQUESTS: "Too many requests",
  DATA_MISSING: "Required data is missing",
  INVALID_DATA: "Invalid data",
  VALIDATION_ERROR: "Validation failed",
  DUPLICATE_DATA: "Data already exists",
} as const;

/////////////////////////////////////////////

export const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  DATA_MISSING: 400,
  INVALID_DATA: 400,
  VALIDATION_ERROR: 400,
  DUPLICATE_DATA: 409,
} as const;

/////////////////////////////////////

export const RESPONSE_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
} as const;
