export type MemberData = {
  userId: number;
  projectId: number;
  role: MemberRole;
  status: MemberStatus;
  joinedAt: Date;
  version?: number;
};

export type MemberRole = "OWNER" | "MEMBER" | "GUEST";
export type MemberStatus = "ACTIVE" | "PENDING" | "REMOVED";

export class MemberEntity {
  private readonly _userId: number;
  private readonly _projectId: number;
  private readonly _joinedAt: Date;

  private _role: MemberRole;
  private _status: MemberStatus;

  constructor(attrs: MemberData) {
    this._userId = attrs.userId;
    this._projectId = attrs.projectId;
    this._role = attrs.role;
    this._status = attrs.status;
    this._joinedAt = attrs.joinedAt;
  }

  get userId() {
    return this._userId;
  }
  get projectId() {
    return this._projectId;
  }
  get role() {
    return this._role;
  }
  get status() {
    return this._status;
  }
  get joinedAt() {
    return this._joinedAt;
  }

  public isOwner(): boolean {
    return this.role === "OWNER";
  }
  public isPending(): boolean {
    return this._status === "PENDING";
  }
  public isActive(): boolean {
    return this._status === "ACTIVE";
  }

  public acceptInvitation(): void {
    if (this._status === "ACTIVE") {
      // 이미 활동 중인 경우 에러처리
      throw new Error();
    }
    if (this._status === "REMOVED") {
      // 제거된 멤버 재초대 불가능
      throw new Error();
    }
    this._status = "ACTIVE";
  }

  updateStatus(newStatus: MemberStatus): void {
    if (newStatus === this._status) return;
    this._status = newStatus;
  }

  public cancelInvitation(cancellerRole: MemberRole): void {
    if (cancellerRole !== "OWNER") {
      // OWNER만 초대를 취소 가능
      throw new Error();
    }

    if (!this.isPending()) {
      // PENDING 상태의 멤버만 취소 가능
      throw new Error();
    }
    this._status = "REMOVED";
  }

  public removeMember(removerRole: MemberRole): void {
    if (removerRole !== "OWNER") {
      // OWNER만 멤버를 제거 가능
      throw new Error();
    }
    if (this.isOwner()) {
      // OWNER는 스스로를 제거 불가.
      throw new Error();
    }

    if (this._status === "REMOVED") {
      // 이미 제거된 멤버 반복 제거 불가
      throw new Error();
    }

    this._status = "REMOVED";
  }

  public updateRole(newRole: MemberRole): void {
    // 추후 룰 체크 추가
    this._role = newRole;
  }

  static createOwner(params: {
    userId: number;
    projectId: number;
  }): MemberEntity {
    return new MemberEntity({
      userId: params.userId,
      projectId: params.projectId,
      role: "OWNER",
      status: "ACTIVE",
      joinedAt: new Date(),
      version: 1,
    });
  }

  static createNewInvited(params: {
    userId: number;
    projectId: number;
    role?: MemberRole;
  }): MemberEntity {
    if (params.role === "OWNER") {
      // OWNER는 초대로 생성 불가
      throw new Error();
    }
    return new MemberEntity({
      ...params,
      role: params.role ?? "MEMBER", //MEMBER 가 디폴트값
      status: "PENDING", // 초대된 멤버는 PENDING 상태로 시작
      joinedAt: new Date(),
    });
  }
  static createPersist(params: MemberData): MemberEntity {
    // 룰체크 추후 추가
    return new MemberEntity(params);
  }
  public toData(): MemberData {
    return {
      userId: this._userId,
      projectId: this._projectId,
      role: this._role,
      status: this._status,
      joinedAt: this._joinedAt,
    };
  }
}
