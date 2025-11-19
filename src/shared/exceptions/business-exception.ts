export enum BusinessExceptionType {
  UNKNOWN_SERVER_ERROR,
}

const BusinessExceptionTable: Record<
BusinessExceptionType,
{statusCode: number; message: string}
  > = {
  [BusinessExceptionType.UNKNOWN_SERVER_ERROR]: {
    statusCode: 500,
    message: "알 수 없는 서버 에러가 발생하였습니다."
  },
}

export class BusinessException extends Error {
  public readonly statusCode: number;
  public readonly type: BusinessExceptionType;
  public readonly error?: Error;

  constructor(options:{
    message?: string,
    type: BusinessExceptionType;
    error?: Error;
  }){
    super(options.message ?? BusinessExceptionTable[options.type].message);
    this.statusCode = BusinessExceptionTable[options.type].statusCode;
    this.type = options.type;
    this.error = options.error;
  }
}