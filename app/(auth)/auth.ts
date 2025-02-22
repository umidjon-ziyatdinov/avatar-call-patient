import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getPatient } from '@/lib/db/queries';
import { authConfig } from './auth.config';



export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {

        const users = await getPatient(email);

        if (users.length === 0) return null;
        // biome-ignore lint: Forbidden non-null assertion.
        const passwordsMatch = await compare(password, users[0].password!);

        if (!passwordsMatch) return null;
        return users[0] as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Add role to token

      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        // Add role to session
        session.user.role = token.role;
      }

      return session;
    },
  },
});