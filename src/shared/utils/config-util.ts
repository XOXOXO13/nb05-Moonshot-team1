import { z } from "zod";

export const configSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  TOKEN_SECRET: z.string().min(10, "토큰 시크릿은 최소 10자 이상입니다."),
  ACCESS_TOKEN_EXPIRES_IN: z.string().regex(/^\d+(h|m|s)$/i, {
    message: "시간 형식은 예: '24h', '30m', '10s' 처럼 입력해야 합니다.",
  }),
});

export type ConfigType = z.infer<typeof configSchema>;
export interface IConfigUtil {
  parsed: () => ConfigType;
}

export class ConfigUtil implements IConfigUtil {
  private _parsedConfig: ConfigType;
  constructor() {
    const result = configSchema.safeParse(process.env);
    if (result.success) {
      this._parsedConfig = result.data;
    } else {
      throw result.error;
    }
  }

  public parsed() {
    return this._parsedConfig;
  }
}
