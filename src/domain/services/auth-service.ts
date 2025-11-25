import {
  AuthTokenResponse,
  IAuthService,
  RefreshTokenInput,
  RefreshTokenResponse,
  SignInInput,
  SignInResponse,
  SignOutInput,
  SignUpInput,
  SignUpOrSignInSocialInput,
  SignUpResponse,
} from "../../inbound/ports/services/I-auth-service";
import { UserEntity } from "../entities/user/user-entity";
import { IHashManager } from "../ports/managers/I-hash-manager";
import { IUserRepository } from "../ports/repositories/I-user-repository";

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashManager: IHashManager
  ) {}
  async signUp(input: SignUpInput): Promise<SignUpResponse> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const newUser = await UserEntity.createNewLocal({
      email: input.email,
      password: input.password,
      name: input.name,
      profileImageUrl: input.profileImage,
      hashManager: this.hashManager,
    });

    const savedUser = await this.userRepository.create(newUser);

    return {
      id: savedUser.id!,
      email: savedUser.email,
      name: savedUser.name,
      profileImage: savedUser.profileImageUrl || undefined,
      createdAt: savedUser.createdAt!,
      updatedAt: savedUser.updatedAt!,
    };
  }

  async signIn(input: SignInInput): Promise<SignInResponse> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await user.isPasswordMatch(
      input.password,
      this.hashManager
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return {
      accessToken: "",
      refreshToken: "",
    };
  }

  async signUpOrSignInSocial(
    input: SignUpOrSignInSocialInput
  ): Promise<AuthTokenResponse> {
    return {
      accessToken: "",
      refreshToken: "",
      csrfToken: "",
    };
  }

  async refreshTokens(input: RefreshTokenInput): Promise<RefreshTokenResponse> {
    return {
      accessToken: "",
      refreshToken: "",
      csrfToken: "",
    };
  }

  async signOut(input: SignOutInput): Promise<void> {}
}
