export enum TechnicalExceptionType {
  UNKNOWN_SERVER_ERROR,
  DB_QUERY_FAILED,
}

const TechnicalExceptionTable: Record<TechnicalExceptionType, string> = {
  [TechnicalExceptionType.UNKNOWN_SERVER_ERROR]:
    "알 수 없는 서버 에러가 발생하였습니다.",
  [TechnicalExceptionType.DB_QUERY_FAILED]:
    "데이터베이스 쿼리 실행 중 오류가 발생했습니다.",
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
