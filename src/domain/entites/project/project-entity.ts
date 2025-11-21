import { MemberData, MemberVo } from "./member-vo";
import { PersistTaskEntity } from "../task/persist-task-entity";

export type ProjectData = {
  name: string;
  description?: string | null;
  userId: number;
  members?: MemberData[];
  version: number;
};

export type ProjectUpdateData = {
  name?: string;
  description?: string | null;
  // members와 version은 별도 처리.
};

// 영속화 전
export type NewProjectEntity = Omit<
  ProjectEntity,
  "id" | "createdAt" | "updatedAt"
>;

// 영속화 후
export interface PersistProjectEntity extends ProjectEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProjectEntity {
  private readonly _id?: number;
  private _name: string;
  private _description?: string | null;
  private readonly _userId: number;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;
  private _members?: MemberVo[];
  private _tasks?: PersistTaskEntity[];

  // 낙관적 락을 위한 버전
  private _version: number;
  private _isModified: boolean = false;

  constructor(attrs: {
    id?: number;
    name: string;
    description?: string | null;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
    members: MemberVo[];
    tasks?: PersistTaskEntity[];
    version: number;
  }) {
    this._id = attrs.id;
    this._name = attrs.name;
    this._description = attrs.description;
    this._userId = attrs.userId;
    this._createdAt = attrs.createdAt;
    this._updatedAt = attrs.updatedAt;
    this._members = attrs.members;
    this._tasks = attrs.tasks;
    this._version = attrs.version;
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get description() {
    return this._description;
  }
  get userId() {
    return this._userId;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get members() {
    return this._members;
  }
  get tasks() {
    return this._tasks;
  }
  get version() {
    return this._version;
  }
  get isModified() {
    return this._isModified;
  }

  toCreateData(): ProjectData {
    return {
      name: this._name,
      description: this._description,
      userId: this._userId,
      members: this._members?.map((m) => m.toData()),
      version: this._version,
    };
  }

  toUpdateData(): ProjectUpdateData {
    if (!this._isModified) {
      return {};
    }
    const updateData: ProjectUpdateData = {};
    updateData.name = this._name;
    updateData.description = this._description;

    return updateData;
  }

  static createNew(params: {
    name: string;
    description?: string;
    userId: number;
  }): NewProjectEntity {
    const { name, description, userId } = params;
    const creator = MemberVo.createNew({
      userId: userId,
      role: "OWNER",
      status: "ACTIVE",
    });

    const entity = new ProjectEntity({
      name,
      description,
      userId,
      members: [creator],
      version: 1,
    });
    return entity;
  }

  static createPersist(parmas: {
    id?: number;
    name: string;
    description?: string | null;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
    members: MemberVo[];
    tasks?: PersistTaskEntity[];
    version: number;
  }) {
    return new ProjectEntity(parmas);
  }

  updateName(newName: string): void {
    if (newName === this._name) return;
    this._name = newName;
    this._isModified = true;
  }

  updateDescription(newDescription: string): void {
    if (newDescription === this._description) return;
    this._description = newDescription;
    this._isModified = true;
  }

  incrementVersion(): void {
    if (this._isModified) {
      this._version++;
    }
  }
}
