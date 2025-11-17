import { profileEnd } from "console";
import { ref } from "process";
import { id } from "zod/v4/locales";

export class UserEntity {
  private readonly id: number;
  private readonly name: string;
  private readonly email: string;
  private readonly profileImage: string | null;
  // private readonly createdAt: Date;
  // private readonly updatedAt: Date;
  // private readonly password: string | null;
  // private readonly refreshToken: string | null;
  // private readonly version: number;

  constructor(
    record: {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      email: string;
      password: string | null;
      refreshToken: string | null;
      version: number;
      profileImage: string;
    } | null,
  ) {
    if (!record) {
      throw Error("유저가 존재하지 않습니다");
    }
    this.id = record.id;
    this.name = record.name;
    this.email = record.email;
    this.profileImage = record.profileImage;
    // this.password = record.password;
    // this.refreshToken = record.refreshToken;
    // this.version = record.version;
    // this.createdAt = record.createdAt;
    // this.updatedAt = record.updatedAt;
  }
}
