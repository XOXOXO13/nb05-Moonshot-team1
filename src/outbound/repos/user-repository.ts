import { PrismaClient } from "@prisma/client";
import { UserEntity } from "../../domain/entities/user/user-entity";
import {
  SocialAccountVo,
  SocialProvider,
} from "../../domain/entities/social-account/social-account-entity";
import {
  IUserRepository,
  LockType,
} from "../../domain/ports/repositories/I-user-repository";
import { BasePrismaClient } from "./base-repository";

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: BasePrismaClient) {}

  async findByEmail(
    email: string,
    lockType?: LockType,
  ): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        socialAccounts: true,
      },
    });

    if (!user) {
      return null;
    }

    return this.toDomainEntity(user);
  }

  async findById(id: number, lockType?: LockType): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        socialAccounts: true,
      },
    });

    if (!user) {
      return null;
    }

    return this.toDomainEntity(user);
  }

  async create(userEntity: UserEntity): Promise<UserEntity> {
    const userData = userEntity.toCreateData();
    const socialAccountsData = userEntity.socialAccounts.map((account) =>
      account.toData(),
    );

    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        profileImage: userData.profileImageUrl,
        refreshToken: userData.refreshToken,
        version: userData.version,
        socialAccounts:
          socialAccountsData.length > 0
            ? {
                create: socialAccountsData.map((account) => ({
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                })),
              }
            : undefined,
      },
      include: {
        socialAccounts: true,
      },
    });

    return this.toDomainEntity(user);
  }

  async update(userEntity: UserEntity): Promise<UserEntity> {
    if (!userEntity.id) {
      throw new Error("User ID is required for update");
    }

    if (!userEntity.isModified) {
      return userEntity;
    }

    const updateData = userEntity.toUpdateData();

    const user = await this.prisma.user.update({
      where: { id: userEntity.id },
      data: {
        password: updateData.password,
        name: updateData.name,
        profileImage: updateData.profileImageUrl,
        refreshToken: updateData.refreshToken,
        version: updateData.version,
      },
      include: {
        socialAccounts: true,
      },
    });

    return this.toDomainEntity(user);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findByRefreshToken(
    refreshToken: string,
    lockType?: LockType,
  ): Promise<UserEntity | null> {
    throw new Error(
      "findByRefreshToken should be implemented in Service layer with proper hash comparison",
    );
  }
  async findBySocialAccount(
    provider: SocialProvider,
    providerAccountId: string,
  ): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        socialAccounts: {
          some: {
            provider: provider,
            providerAccountId: providerAccountId,
          },
        },
      },
      include: {
        socialAccounts: true,
      },
    });

    if (!user) {
      return null;
    }

    return this.toDomainEntity(user);
  }
  private toDomainEntity(prismaUser: any): UserEntity {
    const socialAccounts =
      prismaUser.socialAccounts?.map((account: any) =>
        SocialAccountVo.createPersist({
          id: account.id,
          provider: account.provider as SocialProvider,
          providerAccountId: account.providerAccountId,
          userId: account.userId,
          createdAt: account.createdAt,
        }),
      ) || [];
    return UserEntity.createPersist({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      name: prismaUser.name,
      profileImageUrl: prismaUser.profileImage,
      version: prismaUser.version,
      refreshToken: prismaUser.refreshToken,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      socialAccounts,
    });
  }

  async addSocialAccountToUser(
    userId: number,
    socialAccount: SocialAccountVo,
  ): Promise<void> {
    const accountData = socialAccount.toData();

    await this.prisma.socialAccount.create({
      data: {
        provider: accountData.provider,
        providerAccountId: accountData.providerAccountId,
        userId: userId,
      },
    });
  }
  async removeSocialAccountFromUser(
    userId: number,
    provider: SocialProvider,
  ): Promise<void> {
    await this.prisma.socialAccount.deleteMany({
      where: {
        userId: userId,
        provider: provider,
      },
    });
  }
  async findByEmailForAuthentication(
    email: string,
  ): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        socialAccounts: true,
      },
    });

    if (!user) {
      return null;
    }

    return this.toDomainEntity(user);
  }
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }
  async existsBySocialAccount(
    provider: SocialProvider,
    providerAccountId: string,
  ): Promise<boolean> {
    const count = await this.prisma.socialAccount.count({
      where: {
        provider: provider,
        providerAccountId: providerAccountId,
      },
    });
    return count > 0;
  }
}