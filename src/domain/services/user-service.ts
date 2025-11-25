import { UserEntity } from "../entities/user/user-entity";
import {
  SocialAccountVo,
  SocialProvider,
} from "../entities/social-account/social-account-entity";
import { IUserRepository } from "../ports/repositories/I-user-repository";
import { IHashManager } from "../ports/managers/I-hash-manager";
import { IUserService } from "../../inbound/ports/services/I-user-service";

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashManager: IHashManager,
  ) {}
  async registerLocal(params: {
    email: string;
    password: string;
    name: string;
    profileImageUrl?: string;
  }): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(params.email);
    if (existingUser) {
      throw new Error("이미 사용 중인 이메일입니다.");
    }
    const newUser = await UserEntity.createNewLocal({
      ...params,
      hashManager: this.hashManager,
    });

    return await this.userRepository.create(newUser);
  }

  async registerSocial(params: {
    email: string;
    name: string;
    provider: SocialProvider;
    providerAccountId: string;
  }): Promise<UserEntity> {
    const existingUser = await this.userRepository.findBySocialAccount(
      params.provider,
      params.providerAccountId,
    );
    if (existingUser) {
      throw new Error("이미 연결된 소셜 계정입니다.");
    }
    const userByEmail = await this.userRepository.findByEmail(params.email);
    if (userByEmail) {
      const socialAccount = SocialAccountVo.createNew({
        provider: params.provider,
        providerAccountId: params.providerAccountId,
        userId: userByEmail.id!,
      });

      userByEmail.addSocialAccount(socialAccount);
      return await this.userRepository.update(userByEmail);
    }
    const socialAccount = SocialAccountVo.createNew({
      provider: params.provider,
      providerAccountId: params.providerAccountId,
      userId: 0,
    });
    const newUser = UserEntity.createNewSocial({
      email: params.email,
      name: params.name,
      socialAccount,
    });

    return await this.userRepository.create(newUser);
  }

  async loginLocal(email: string, password: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    const isPasswordValid = await user.isPasswordMatch(
      password,
      this.hashManager,
    );
    if (!isPasswordValid) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }

    return user;
  }
  async loginSocial(
    provider: SocialProvider,
    providerAccountId: string,
  ): Promise<UserEntity | null> {
    return await this.userRepository.findBySocialAccount(
      provider,
      providerAccountId,
    );
  }

  async findById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findByEmail(email);
  }

  async updateProfile(
    userId: number,
    params: { name?: string; profileImageUrl?: string },
  ): Promise<UserEntity> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    user.updateProfile(params);
    return await this.userRepository.update(user);
  }

  async updatePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    const isCurrentPasswordValid = await user.isPasswordMatch(
      currentPassword,
      this.hashManager,
    );
    if (!isCurrentPasswordValid) {
      throw new Error("현재 비밀번호가 일치하지 않습니다.");
    }

    await user.updatePassword(newPassword, this.hashManager);
    await this.userRepository.update(user);
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    await user.updateRefreshToken(refreshToken, this.hashManager);
    await this.userRepository.update(user);
  }

  async validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return false;
    }

    return await user.isRefreshTokenMatch(refreshToken, this.hashManager);
  }

  async deleteRefreshToken(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    user.deleteRefreshToken();
    await this.userRepository.update(user);
  }

  async unlinkSocialAccount(
    userId: number,
    provider: SocialProvider,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    if (!user.hasSocialAccount(provider)) {
      throw new Error("연결된 소셜 계정이 없습니다.");
    }
    if (!user.password && user.socialAccounts.length === 1) {
      throw new Error(
        "최소 하나의 로그인 방법이 필요합니다. 비밀번호를 설정하거나 다른 소셜 계정을 연결해주세요.",
      );
    }

    user.removeSocialAccount(provider);
    await this.userRepository.update(user);
  }

  async registerUser(input: {
    email: string;
    password: string;
    name: string;
    profileImageUrl?: string;
  }): Promise<UserEntity> {
    return this.registerLocal(input);
  }

  async registerSocialUser(input: {
    email: string;
    name: string;
    provider: SocialProvider;
    providerAccountId: string;
  }): Promise<UserEntity> {
    return this.registerSocial(input);
  }

  async loginUser(email: string, password: string): Promise<UserEntity> {
    return this.loginLocal(email, password);
  }

  async loginSocialUser(
    provider: SocialProvider,
    providerAccountId: string,
  ): Promise<UserEntity | null> {
    return this.loginSocial(provider, providerAccountId);
  }

  async getMyProfile(userId: number): Promise<UserEntity> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }
    return user;
  }

  async getUserProfile(userId: number): Promise<UserEntity> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }
    return user;
  }

  async updateMyProfile(input: {
    userId: number;
    name?: string;
    profileImageUrl?: string;
  }): Promise<UserEntity> {
    return this.updateProfile(input.userId, {
      name: input.name,
      profileImageUrl: input.profileImageUrl,
    });
  }

  async changePassword(input: {
    userId: number;
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    return this.updatePassword(
      input.userId,
      input.currentPassword,
      input.newPassword,
    );
  }

  async deleteMyAccount(userId: number): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }
    await this.userRepository.delete(userId);
  }

  async linkSocialAccount(input: {
    userId: number;
    provider: SocialProvider;
    providerAccountId: string;
  }): Promise<void> {
    const existingUser = await this.userRepository.findBySocialAccount(
      input.provider,
      input.providerAccountId,
    );
    if (existingUser && existingUser.id !== input.userId) {
      throw new Error("다른 사용자에게 이미 연결된 소셜 계정입니다.");
    }

    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    if (user.hasSocialAccount(input.provider)) {
      throw new Error("이미 해당 소셜 계정이 연결되어 있습니다.");
    }

    const socialAccount = SocialAccountVo.createNew({
      provider: input.provider,
      providerAccountId: input.providerAccountId,
      userId: input.userId,
    });

    user.addSocialAccount(socialAccount);
    await this.userRepository.update(user);
  }

  async refreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const isValid = await this.validateRefreshToken(userId, refreshToken);
    if (!isValid) {
      throw new Error("유효하지 않은 리프레시 토큰입니다.");
    }

    return {
      accessToken: "",
      refreshToken: "",
    };
  }

  async logout(userId: number): Promise<void> {
    await this.deleteRefreshToken(userId);
  }
}
