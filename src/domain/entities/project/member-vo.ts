export type MemberData = {
  userId: number;
  role: MemberRole;
  status: MemberStatus;
};
export type MemberRole = "OWNER" | "MEMBER" | "GUEST";
export type MemberStatus = "ACTIVE" | "PENDING" | "REMOVED";

export class MemberVo {
  private readonly _userId: number;
  private readonly _role: MemberRole;
  private readonly _status: MemberStatus;

  constructor(attrs: {
    userId: number;
    role: MemberRole;
    status: MemberStatus;
  }) {
    this._userId = attrs.userId;
    this._role = attrs.role;
    this._status = attrs.status;
  }

  get userId() {
    return this._userId;
  }

  get role() {
    return this._role;
  }

  get status() {
    return this._status;
  }

  isEquals(vo: MemberVo): boolean {
    if (this.userId !== vo.userId) {
      return false;
    }
    if (this._role !== vo._role) {
      return false;
    }
    if (this._status !== vo._status) {
      return false;
    }
    return true;
  }

  toData(): MemberData {
    return {
      userId: this._userId,
      role: this._role,
      status: this._status,
    };
  }

  static createNew(params: {
    userId: number;
    role: MemberRole;
    status: MemberStatus;
  }): MemberVo {
    // 룰체크 추후 추가
    return new MemberVo({ ...params });
  }

  static createPersist(params: MemberData): MemberVo {
    // 룰체크 추후 추가
    return new MemberVo(params);
  }
}