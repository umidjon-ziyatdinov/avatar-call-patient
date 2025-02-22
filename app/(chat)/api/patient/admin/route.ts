import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { user } from '@/lib/db/schema';
import { auth } from '@/app/(auth)/auth';
import { getAdminUser } from '@/lib/db/queries';

export async function POST(request: Request) {
    try {
        const { passcode } = JSON.parse(await request.text());
        console.log('passcode', passcode)
        if (!passcode) {
            return NextResponse.json(
                { error: 'Passcode is required' },
                { status: 400 }
            );
        }
        const session = await auth()
        // Get session to get user ID


        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const foundUser = await getAdminUser(passcode)
        if (!foundUser) {
            return NextResponse.json(
                { error: 'Invalid passcode' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                role: foundUser.role,
                name: foundUser.name,
                id: foundUser.id
            }
        });

    } catch (error) {
        console.error('Error in passcode authentication:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}