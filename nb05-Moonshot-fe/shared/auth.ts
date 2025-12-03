import { cookies } from "next/headers";
import * as api from "./api";

const ACCESS_TOKEN_COOKIE_NAME = "access-token";
const REFRESH_TOKEN_COOKIE_NAME = "refresh-token";

export const setAuthCookies = async (
  accessToken: string,
  refreshToken: string,
) => {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/", // TODO: 경로 수정
  });
};

export const refreshTokens = async (): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  if (!refreshToken) {
    return null;
  }

  try {
    const newTokens = await api.refreshToken(refreshToken);
    await setAuthCookies(newTokens.accessToken, newTokens.refreshToken);
    return newTokens;
  } catch (error) {
    return null;
  }
};

export const deleteAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
};

export const getAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  if (!accessToken) {
    return null;
  }
  return accessToken;
};
