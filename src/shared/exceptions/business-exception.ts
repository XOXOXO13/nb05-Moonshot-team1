export enum BusinessExceptionType {
  UNKNOWN_SERVER_ERROR,
  INVALID_AUTH,
  ALREADY_AUTHENTICATED,
  EMAIL_DUPLICATE,
  INVALID_PROJECTID,
  UNAUTORIZED_REQUEST,
  UPDATE_TARGET_NOT_FOUND,
  NOT_MEMBER,
  INVALID_TOKEN,
  EXPIRED_TOKEN,
  INVALID_REQUEST,
  INVALID_TITLE,
  INVALID_DESCRIPTION,
}

const BusinessExceptionTable: Record<
  BusinessExceptionType,
  { statusCode: number; message: string }
> = {
  [BusinessExceptionType.UNKNOWN_SERVER_ERROR]: {
    statusCode: 500,
    message: "알 수 없는 서버 에러가 발생하였습니다.",
  },
  [BusinessExceptionType.INVALID_AUTH]: {
    statusCode: 401,
    message: "로그인이 필요합니다.",
  },
  [BusinessExceptionType.ALREADY_AUTHENTICATED]: {
    statusCode: 400,
    message: "이미 로그인된 사용자입니다.",
  },
  [BusinessExceptionType.EMAIL_DUPLICATE]: {
    statusCode: 409,
    message: "중복된 입니다.",
  },
  [BusinessExceptionType.INVALID_PROJECTID]: {
    statusCode: 404,
    message: "Project가 존재하지 않습니다.",
  },
  [BusinessExceptionType.UNAUTORIZED_REQUEST]: {
    statusCode: 403,
    message: "권한이 없습니다.",
  },
  [BusinessExceptionType.UPDATE_TARGET_NOT_FOUND]: {
    statusCode: 404,
    message: "업데이트 할 항목이 없습니다.",
  },
  [BusinessExceptionType.NOT_MEMBER]: {
    statusCode: 403,
    message: "프로젝트 멤버가 아닙니다",
  },
  [BusinessExceptionType.INVALID_TOKEN]: {
    statusCode: 404,
    message: "토큰이 존재하지 않습니다.",
  },
  [BusinessExceptionType.EXPIRED_TOKEN]: {
    statusCode: 404,
    message: "토큰이 만료기한기 지났습니다.",
  },

  [BusinessExceptionType.INVALID_REQUEST]: {
    statusCode: 400,
    message: "잘못된 요청 형식",
  },
  [BusinessExceptionType.INVALID_TITLE]: {
    statusCode: 400,
    message: "제목 형식이 잘못됬습니다.",
  },
  [BusinessExceptionType.INVALID_DESCRIPTION]: {
    statusCode: 400,
    message: "설명 형식이 잘못됬습니다.",
  },
};

export const INPUT_EXCEPTIONS: Record<string, BusinessExceptionType> = {
  title: BusinessExceptionType.INVALID_TITLE,
  description: BusinessExceptionType.INVALID_DESCRIPTION,
};

export class BusinessException extends Error {
  public readonly statusCode: number;
  public readonly type: BusinessExceptionType;
  public readonly error?: Error;

  constructor(options: {
    message?: string;
    type: BusinessExceptionType;
    error?: Error;
  }) {
    super(options.message ?? BusinessExceptionTable[options.type].message);
    this.statusCode = BusinessExceptionTable[options.type].statusCode;
    this.type = options.type;
    this.error = options.error;
  }
}
