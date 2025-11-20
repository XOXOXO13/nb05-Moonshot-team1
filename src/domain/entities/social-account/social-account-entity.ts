

export enum SocialProvider {
  GOOGLE = "google",
}

export type SocialAccountCreateData = {
  provider: SocialProvider;
  providerId: string;
  userId: number;
};

export class SocialAccountEntity {
  private readonly _id?: string;
  private readonly _provider: SocialProvider;
  private readonly _providerId: string;
  private readonly _userId: number;
  private readonly _createdAt?: Date; //linkedAt

  constructor(attrs: {
    id?: string;
    provider: SocialProvider;
    providerId: string;
    userId: number;
    createdAt: Date;
  }) {
    this._id = attrs.id;
    this._provider = attrs.provider;
    this._providerId = attrs.providerId;
    this._userId = attrs.userId;
    this._createdAt = attrs.createdAt;
  }

  get id() {
    return this._id;
  }
  get provider() {
    return this._provider;
  }
  get providerId() {
    return this._providerId;
  }
  get userId() {
    return this._userId;
  }
  get createdAt() {
    return this._createdAt;
  }

  static createNew(params: {
    provider: SocialProvider;
    providerId: string;
    userId: number;
  }): SocialAccountEntity {
    SocialAccountEntity.validateProvider(params.provider);
    SocialAccountEntity.validateProviderId(params.providerId);
    return new SocialAccountEntity({ ...params, createdAt: new Date() });
  }

  static createPersist(params: {
    id: string;
    provider: SocialProvider;
    providerId: string;
    userId: number;
    createdAt: Date;
  }): SocialAccountEntity {
    return new SocialAccountEntity(params);
  }
  private static validateProvider(provider: SocialProvider): void {
    if (!Object.values(SocialProvider).includes(provider)) {
      throw new Error(`지원되지 않는 소셜로그인입니다: ${provider}`);
    }
  }

  private static validateProviderId(providerId: string): void {
    if (!providerId || providerId.trim().length === 0) {
      throw new Error(`Provider Id는 필수입니다.`);
    }
  }

  toCreateData(): SocialAccountCreateData {
    return {
      provider: this._provider,
      providerId: this._providerId,
      userId: this._userId,
    };
  }

  static createGoogleAccount(params: {
    googleId: string;
    userId: number;
  }): SocialAccountEntity {
    return SocialAccountEntity.createNew({
      provider: SocialProvider.GOOGLE,
      providerId: params.googleId,
      userId: params.userId,
    });
  }

  isSameProvider(provider: SocialProvider): boolean {
    return this._provider === provider;
  }

  isSameProviderId(providerId: string): boolean {
    return this._providerId === providerId;
  }
}
