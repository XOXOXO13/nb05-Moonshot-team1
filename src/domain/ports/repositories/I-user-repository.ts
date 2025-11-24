import { UserEntity } from "../../entites/user/user-entity";
import { SocialProvider } from "../../entites/social-account/social-account-entity";

export type LockType = "FOR_UPDATE" | "FOR_SHARE";

export interface IUserRepository {
  findByEmail(email: string, lockType?: LockType): Promise<UserEntity | null>;
  findById(id: number, lockType?: LockType): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity>;
  update(user: UserEntity): Promise<UserEntity>;
  delete(id: number): Promise<void>;
  findByRefreshToken(
    refreshToken: string,
    lockType?: LockType,
  ): Promise<UserEntity | null>;

  findBySocialAccount(
    provider: SocialProvider,
    providerAccountId: string,
  ): Promise<UserEntity | null>;
}
