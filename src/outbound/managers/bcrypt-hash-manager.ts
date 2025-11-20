import * as bcrypt from 'bcrypt';
import { IHashManager } from "../../domain/ports/managers/I-hash-manager";

export class BcryptHashManager implements IHashManager {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  async hash(plainString: string): Promise<string> {
    return await bcrypt.hash(plainString, this.saltRounds);
  }

  async compare(plainString: string, hashedString: string): Promise<boolean> {
    return await bcrypt.compare(plainString, hashedString);
  }
}
