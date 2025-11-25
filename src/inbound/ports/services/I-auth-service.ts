export interface SignUpInput {
  email: string;
  password: string;
  name: string;
  profileImage?: string;
}
export interface SignUpResponse {
  id: number;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface SignInInput {
  email: string;
  password: string;
}
export interface SignUpOrSignInSocialInput {
  authCode: string;
  provider: string;
}
export interface RefreshTokenInput {
  refreshToken: string;
}
export interface SignOutInput {
  refreshToken: string;
}
export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}
export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}
export interface IAuthService {
  signUp(input: SignUpInput): Promise<SignUpResponse>;
  signIn(input: SignInInput): Promise<SignInResponse>;
  signUpOrSignInSocial(
    input: SignUpOrSignInSocialInput,
  ): Promise<AuthTokenResponse>;
  refreshTokens(input: RefreshTokenInput): Promise<RefreshTokenResponse>;
  signOut(input: SignOutInput): Promise<void>;
}
