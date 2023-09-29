export enum ExceptionStatus {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500
}

export interface IExceptionResponse {
  status: ExceptionStatus;
  message: string | string[];
}



