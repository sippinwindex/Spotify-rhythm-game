import 'next-auth/jwt';

type SpotifyError = 'RefreshAccessTokenError' | string;

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: SpotifyError;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: SpotifyError;
  }
}
