// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        role: 'admin' | 'moderator' | 'user';
        // ... other user properties
    }

    interface Session {
        user: User;
    }
}