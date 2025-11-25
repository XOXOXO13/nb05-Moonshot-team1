import { IHashManager } from "../../ports/managers/I-hash-manager";
import {
  SocialAccountVo,
  SocialProvider,
} from "../social-account/social-account-entity";

export type UserCreateData = {
  email: string;
  password?: string;
  name: string;
  profileImageUrl?: string;
  refreshToken?: string;
  version: number;
};

export type UserUpdateData = {
  password?: string;
  name: string;
  profileImageUrl?: string;
  refreshToken?: string;
  version: number;
};

export type NewUserEntity = Omit<UserEntity, "id" | "createdAt" | "updatedAt">;

export interface PersistUserEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity {
  private readonly _id?: number;
  private _email: string;
  private _password?: string;
  private _name: string;
  private _profileImageUrl?: string;
  private _refreshToken?: string;
  private _isModified: boolean;
  private _version: number;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;
  private _socialAccounts: SocialAccountVo[];

  constructor(attrs: {
    id?: number;
    email: string;
    password?: string;
    name: string;
    profileImageUrl?: string;
    version: number;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
    socialAccounts?: SocialAccountVo[];
  }) {
    this._id = attrs.id;
    this._email = attrs.email;
    this._password = attrs.password;
    this._name = attrs.name;
    this._profileImageUrl = attrs.profileImageUrl;
    this._isModified = false;
    this._version = attrs.version;
    this._refreshToken = attrs.refreshToken;
    this._createdAt = attrs.createdAt;
    this._updatedAt = attrs.updatedAt;
    this._socialAccounts = attrs.socialAccounts || [];
  }

  get id() {
    return this._id;
  }
  get email() {
    return this._email;
  }
  get password() {
    return this._password;
  }
  get name() {
    return this._name;
  }
  get profileImageUrl() {
    return this._profileImageUrl;
  }
  get isModified() {
    return this._isModified;
  }
  get version() {
    return this._version;
  }
  get refreshToken() {
    return this._refreshToken;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  toCreateData(): UserCreateData {
    return {
      email: this._email,
      password: this._password,
      name: this._name,
      profileImageUrl: this._profileImageUrl,
      refreshToken: this._refreshToken,
      version: this._version,
    };
  }

  toUpdateData(): UserUpdateData {
    return {
      password: this._password,
      name: this._name,
      profileImageUrl: this._profileImageUrl,
      refreshToken: this._refreshToken,
      version: this._version,
    };
  }
  static async createNewLocal(params: {
    email: string;
    password: string;
    name: string;
    profileImageUrl?: string;
    hashManager: IHashManager;
  }): Promise<UserEntity> {
    const { email, password, name, profileImageUrl, hashManager } = params;

    UserEntity.validatePassword(password);
    UserEntity.validateName(name);
    UserEntity.validateEmail(email);

    const hashedPassword = await hashManager.hash(password);

    return new UserEntity({
      email,
      password: hashedPassword,
      name,
      profileImageUrl,
      version: 1,
    });
  }

  static createNewSocial(params: {
    email: string;
    name: string;
    socialAccount: SocialAccountVo;
  }): UserEntity {
    const { email, name, socialAccount } = params;

    UserEntity.validateName(name);
    UserEntity.validateEmail(email);

    return new UserEntity({
      email,
      name,
      version: 1,
      socialAccounts: [socialAccount],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  static createPersist(params: {
    id: number;
    email: string;
    password?: string;
    name: string;
    profileImageUrl?: string;
    version: number;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
    socialAccounts?: SocialAccountVo[];
  }): UserEntity {
    return new UserEntity(params);
  }
  private static validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error("비밀번호는 8자 이상이어야 합니다.");
    }
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("이름은 필수입니다.");
    }
  }

  private static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("올바른 이메일 형식이 아닙니다.");
    }
  }

  async isPasswordMatch(
    password: string,
    hashManager: IHashManager,
  ): Promise<boolean> {
    if (!this._password) {
      throw new Error("일치하는 계정이 존재하지 않습니다.");
    }

    return await hashManager.compare(password, this._password);
  }

  async updatePassword(
    newPassword: string,
    hashManager: IHashManager,
  ): Promise<void> {
    UserEntity.validatePassword(newPassword);
    this._password = await hashManager.hash(newPassword);
    this._isModified = true;
  }
  updateProfile(params: { name?: string; profileImageUrl?: string }): void {
    if (params.name !== undefined) {
      UserEntity.validateName(params.name);
      this._name = params.name;
      this._isModified = true;
    }

    if (params.profileImageUrl !== undefined) {
      this._profileImageUrl = params.profileImageUrl;
      this._isModified = true;
    }
  }
  async updateRefreshToken(
    refreshToken: string,
    hashManager: IHashManager,
  ): Promise<void> {
    const hashedToken = await hashManager.hash(refreshToken);
    this._refreshToken = hashedToken;
    this._isModified = true;
  }

  deleteRefreshToken(): void {
    this._refreshToken = undefined;
    this._isModified = true;
  }

  async isRefreshTokenMatch(
    refreshToken: string,
    hashManager: IHashManager,
  ): Promise<boolean> {
    if (!this._refreshToken) {
      return false;
    }

    return await hashManager.compare(refreshToken, this._refreshToken);
  }

  incrementVersion(): void {
    if (this._isModified) {
      this._version++;
    }
  }
  get socialAccounts(): SocialAccountVo[] {
    return this._socialAccounts;
  }

  addSocialAccount(socialAccount: SocialAccountVo): void {
    const existingAccount = this._socialAccounts.find(
      (account) => account.provider === socialAccount.provider,
    );

    if (existingAccount) {
      throw new Error(`User already has a ${socialAccount.provider} account`);
    }

    this._socialAccounts.push(socialAccount);
    this._isModified = true;
  }

  removeSocialAccount(provider: SocialProvider): void {
    const index = this._socialAccounts.findIndex(
      (account) => account.provider === provider,
    );

    if (index === -1) {
      throw new Error(`Social account with provider ${provider} not found`);
    }

    this._socialAccounts.splice(index, 1);
    this._isModified = true;
  }

  getSocialAccountByProvider(provider: SocialProvider): SocialAccountVo | null {
    return (
      this._socialAccounts.find((account) => account.provider === provider) ||
      null
    );
  }
  hasSocialAccount(provider: SocialProvider): boolean {
    return this._socialAccounts.some(
      (account) => account.provider === provider,
    );
  }
}
