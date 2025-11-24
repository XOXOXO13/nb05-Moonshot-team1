import { UserEntity } from "../../../domain/entites/user/user-entity";
import { SocialProvider } from "../../../domain/entites/social-account/social-account-entity";

export interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
  profileImageUrl?: string;
}
export interface RegisterSocialInput {
  email: string;
  name: string;
  provider: SocialProvider;
  providerAccountId: string;
}
export interface UpdateProfileInput {
  userId: number;
  name?: string;
  profileImageUrl?: string;
}
export interface ChangePasswordInput {
  userId: number;
  currentPassword: string;
  newPassword: string;
}
export interface LinkSocialAccountInput {
  userId: number;
  provider: SocialProvider;
  providerAccountId: string;
}
export interface IUserService {
  registerUser(input: RegisterUserInput): Promise<UserEntity>;
  registerSocialUser(input: RegisterSocialInput): Promise<UserEntity>;
  loginUser(email: string, password: string): Promise<UserEntity>;
  loginSocialUser(
    provider: SocialProvider,
    providerAccountId: string,
  ): Promise<UserEntity | null>;
  getMyProfile(userId: number): Promise<UserEntity>;
  getUserProfile(userId: number): Promise<UserEntity>;
  updateMyProfile(input: UpdateProfileInput): Promise<UserEntity>;

  changePassword(input: ChangePasswordInput): Promise<void>;

  deleteMyAccount(userId: number): Promise<void>;

  linkSocialAccount(input: LinkSocialAccountInput): Promise<void>;

  unlinkSocialAccount(userId: number, provider: SocialProvider): Promise<void>;

  refreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;

  logout(userId: number): Promise<void>;
  findById(id: number): Promise<UserEntity | null>;

  findByEmail(email: string): Promise<UserEntity | null>;

  updateProfile(
    userId: number,
    params: { name?: string; profileImageUrl?: string },
  ): Promise<UserEntity>;
}
