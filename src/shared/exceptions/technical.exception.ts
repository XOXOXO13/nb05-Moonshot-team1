export enum TechnicalExceptionType {
  UNKNOWN_SERVER_ERROR,
}

const TechnicalExceptionTable: Record<TechnicalExceptionType, string> = {
  [TechnicalExceptionType.UNKNOWN_SERVER_ERROR]: "알 수 없는 서버 에러가 발생하였습니다."
};

export class TechnicalException extends Error {
  public readonly type: TechnicalExceptionType;
  public readonly error?: Error;
  public readonly meta?: unknown;

  constructor(options: {
    message?: string;
    type: TechnicalExceptionType;
    error?: Error;
  }) {
    super(options.message ?? TechnicalExceptionTable[options.type]);
    this.type = options.type;
    this.error = options.error;
  }
}
