import { IConfigUtil } from "./utils/config-util";
import { ITokenUtil } from "./utils/token-util";

export interface IUtils {
  config: IConfigUtil;
  token: ITokenUtil;
}

export class Utils implements IUtils {
  constructor(
    public readonly config: IConfigUtil,
    public readonly token: ITokenUtil,
  ) {}
}
