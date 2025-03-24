import NextAuth from 'next-auth';

import { authConfig } from '@/app/(auth)/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/app', '/app/:id*', '/api/:path*', '/login', '/register'], // Modified matcher
};
