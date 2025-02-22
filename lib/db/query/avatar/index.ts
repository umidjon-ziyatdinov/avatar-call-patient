
import 'server-only';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { and, asc, desc, eq, gt, gte, inArray, isNull, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import {
    user,
    chat,
    type User,
    document,
    type Suggestion,
    suggestion,
    type Message,
    message,
    vote,
    avatar, type Avatar,
    Call,
    call,
    NewCall,
    PromptTemplate,
    promptTemplate
} from '../../schema';

import { auth } from '@/app/(auth)/auth';







// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function getPrompts(type: 'avatar' | 'patient'): Promise<Array<PromptTemplate>> {
    try {
        return await db.select().from(promptTemplate).where(eq(promptTemplate.type, type));
    } catch (error) {
        console.error('Failed to get user from database');
        throw error;
    }
}
























