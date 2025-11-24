export interface IGoogleExternal {
  getAccessToken(): Promise<{ accessToken: string }>;
  getProfile(): Promise<{ id: string; email: string; name: string }>;
}
