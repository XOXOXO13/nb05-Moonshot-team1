export type SocialProvider = "google";

export type SocialAccountData = {
  provider: SocialProvider;
  providerAccountId: string;
  userId: number;
};

export class SocialAccountVo {
  private readonly _provider: SocialProvider;
  private readonly _providerAccountId: string;
  private readonly _userId: number;
  private readonly _createdAt?: Date;

  constructor(attrs: {
    provider: SocialProvider;
    providerAccountId: string;
    userId: number;
    createdAt?: Date;
  }) {
    this._provider = attrs.provider;
    this._providerAccountId = attrs.providerAccountId;
    this._userId = attrs.userId;
    this._createdAt = attrs.createdAt;
  }

  get provider() {
    return this._provider;
  }
  get providerAccountId() {
    return this._providerAccountId;
  }
  get userId() {
    return this._userId;
  }
  get createdAt() {
    return this._createdAt;
  }

  isEquals(vo: SocialAccountVo) {
    if (this._provider !== vo._provider) {
      return false;
    }
    if (this._providerAccountId !== vo.providerAccountId) {
      return false;
    }
    if (this._userId !== vo._userId) {
      return false;
    }
    if (this._createdAt !== vo._createdAt) {
      return false;
    }
    return false;
  }
  toData(): SocialAccountData {
    return {
      provider: this._provider,
      providerAccountId: this._providerAccountId,
      userId: this._userId,
    };
  }

  static createNew(params: {
    provider: SocialProvider;
    providerAccountId: string;
    userId: number;
  }): SocialAccountVo {
    return new SocialAccountVo({ ...params });
  }

  static createPersist(params: {
    id: string;
    provider: SocialProvider;
    providerAccountId: string;
    userId: number;
    createdAt: Date;
  }): SocialAccountVo {
    return new SocialAccountVo({ ...params });
  }
}
