import { auth } from "@/app/(auth)/auth";
import { getUserById, updateUser } from "@/lib/db/queries";
import { getPrompts } from "@/lib/db/query/avatar";
import { NextResponse } from "next/server";








export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {



        const prompts = await getPrompts('avatar');

        return NextResponse.json(
            prompts,
            { status: 200 }
        );




    } catch (error) {
        console.error('Failed to fetch users:', error);
        return new Response('Failed to fetch users', { status: 500 });
    }
}
