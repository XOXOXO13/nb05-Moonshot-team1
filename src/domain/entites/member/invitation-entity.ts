import { MemberRole } from "./member-entity";

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
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private readonly _projectId: number;
  private readonly _inviteeId: number;
  private readonly _creatorId: number;
  private readonly _role: MemberRole;
  private readonly _expiresAt: Date;
  private _version: number;
  private _isModified: boolean = false;

  constructor(attrs: {
    token: string;
    projectId: number;
    inviteeId: number;
    creatorId: number;
    role: MemberRole;
    expiresAt: Date;
    version: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._token = attrs.token;
    this._projectId = attrs.projectId;
    this._inviteeId = attrs.inviteeId;
    this._creatorId = attrs.creatorId;
    this._role = attrs.role;
    this._expiresAt = attrs.expiresAt;
    this._version = attrs.version;
    this._createdAt = attrs.createdAt;
    this._updatedAt = attrs.updatedAt;
  }

  get token() {
    return this._token;
  }
  get projectId() {
    return this._projectId;
  }
  get inviteeId() {
    return this._inviteeId;
  }
  get creatorId() {
    return this._creatorId;
  }
  get role() {
    return this._role;
  }
  get expiresAt() {
    return this._expiresAt;
  }
  get version() {
    return this._version;
  }
  get isModified() {
    return this._isModified;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  isExpired(): boolean {
    return this._expiresAt < new Date();
  }

  private incrementVersion(): void {
    if (this._isModified) {
      this._version++;
    }
  }

  static createNew(params: {
    token: string;
    projectId: number;
    inviteeId: number;
    creatorId: number;
    role: MemberRole;
    expiresAt: Date;
  }): NewInvitationEntity {
    const { token, projectId, inviteeId, creatorId, role, expiresAt } = params;
    const entity = new InvitationEntity({
      token,
      projectId,
      inviteeId,
      creatorId,
      role,
      expiresAt,
      version: 1,
    });
    return entity;
  }

  static createPersist(
    params: InvitationData & { createdAt: Date; updatedAt: Date }
  ): PersistInvitationEntity {
    const role : MemberRole = params.role || "MEMBER";

    return new InvitationEntity({
      ...params,
      role,
    }) as PersistInvitationEntity;
  }

  public toData(): Omit<InvitationData, "role" | "version"> & { version: number } {
    return {
      token: this._token,
      projectId: this._projectId,
      inviteeId: this._inviteeId,
      creatorId: this._creatorId,
      expiresAt: this._expiresAt,
      version: this._version
    };
  }

  public toUpdateData(): InvitationUpdateData{
    if(!this._isModified){
      return {};
    }
    const updateData : InvitationUpdateData = {
      version: this._version,
    }
    return updateData;
  }
}
