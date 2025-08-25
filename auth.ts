// Types for callbacks (user is optional in v5)
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
// Correct import for JWT
import Spotify from 'next-auth/providers/spotify';

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID ?? '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope:
            'user-read-private user-read-email streaming user-library-read',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
      profile: _profile,
      user: _user,
      trigger: _trigger,
      isNewUser: _isNewUser,
      session: _session,
    }) {
      // Include all v5 params, but destructure only needed; inference handles the rest
      // Initial sign-in: Assign tokens and expiration
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at
          ? account.expires_at * 1000
          : Date.now(); // Convert to ms
      }

      // Refresh token if expired (Spotify-specific logic)
      if (Date.now() > (token.expiresAt ?? 0)) {
        try {
          const response = await fetch(
            'https://accounts.spotify.com/api/token',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(
                  `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                ).toString('base64')}`,
              },
              body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: token.refreshToken as string,
              }),
            }
          );

          const refreshedTokens = await response.json();

          if (!response.ok) {
            throw refreshedTokens;
          }

          token.accessToken = refreshedTokens.access_token;
          token.expiresAt = Date.now() + refreshedTokens.expires_in * 1000;
          token.refreshToken =
            refreshedTokens.refresh_token ?? token.refreshToken; // Spotify may not always return a new refresh token
        } catch (error) {
          // eslint-disable-next-line no-console -- Allow for debugging
          console.error('Error refreshing access token', error);
          token.error = 'RefreshAccessTokenError';
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Inference handles types
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      session.error = token.error;
      return session;
    },
    async signIn({ account: _account, profile }) {
      // Inference handles types
      // Optional: Validate Spotify profile (e.g., ensure email exists)
      return !!profile?.email;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
