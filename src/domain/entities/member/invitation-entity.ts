import { MemberRole } from "./member-entity";
export type CreateInvitationData = {};
export type InvitationData = {
  token: string; // id 역할
  projectId: number;
  inviteeId: number;
  creatorId: number;
  role: MemberRole;
  expiresAt: Date;
  version: number;
};

export type InvitationUpdateData = {
  version?: number;
};

export type NewInvitationEntity = Omit<
  InvitationEntity,
  "createdAt" | "updatedAt"
>;

export interface PersistInvitationEntity extends InvitationEntity {
  createdAt: Date;
  updatedAt: Date;
}

export class InvitationEntity {
  private _token: string;
  private readonly _projectId: number;
  private readonly _invitorId: number;
  private readonly _expiresAt: Date;
  private readonly _createdAt?: Date;
  private _role: MemberRole;
  private _version: number;
  private _isModified: boolean = false;

  constructor(attrs: {
    token: string;
    projectId: number;
    invitorId: number;
    expiresAt: Date;
    createdAt?: Date;
    role: MemberRole;
  }) {
    this._token = attrs.token;
    this._projectId = attrs.projectId;
    this._invitorId = attrs.invitorId;
    this._expiresAt = attrs.expiresAt;
    this._createdAt = attrs.createdAt;
    this._role = attrs.role;
    this._version = 1;
  }

  get token() {
    return this._token;
  }
  get projectId() {
    return this._projectId;
  }
  get invitorId() {
    return this._invitorId;
  }
  get expiresAt() {
    return this._expiresAt;
  }
  get role() {
    return this._role;
  }
  get createdAt() {
    return this._createdAt;
  }
  get version() {
    return this._version;
  }
  get isModified() {
    return this._isModified;
  }

  isExpired(): boolean {
    return this._expiresAt < new Date();
  }

  private incrementVersion(): void {
    if (this._isModified) {
      this._version++;
    }
  }

  // static createNew(params: {
  //   token: string;
  //   projectId: number;
  //   invitorId: number;
  //   expiresAt: Date;
  // }): NewInvitationEntity {
  //   const { token, projectId, inviteeId, creatorId, role, expiresAt } = params;
  //   const entity = new InvitationEntity({
  //     token,
  //     projectId,
  //     inviteeId,
  //     creatorId,
  //     role,
  //     expiresAt,
  //     version: 1,
  //   });
  //   return entity;
  // }

  // static createPersist(
  //   params: InvitationData & { createdAt: Date; updatedAt: Date },
  // ): PersistInvitationEntity {
  //   const role: MemberRole = params.role || "MEMBER";

  //   return new InvitationEntity({
  //     ...params,
  //     role,
  //   }) as PersistInvitationEntity;
  // }

  // public toData(): Omit<InvitationData, "version"> & { version: number } {
  //   return {
  //     token: this._token,
  //     projectId: this._projectId,
  //     inviteeId: this._inviteeId,
  //     creatorId: this._creatorId,
  //     expiresAt: this._expiresAt,
  //     role: this._role,
  //     version: this._version,
  //   };
  // }

  // public toUpdateData(): InvitationUpdateData {
  //   if (!this._isModified) {
  //     return {};
  //   }
  //   const updateData: InvitationUpdateData = {
  //     version: this._version,
  //   };
  //   return updateData;
  // }
}
