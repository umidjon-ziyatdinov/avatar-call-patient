import { auth } from "@/app/(auth)/auth";
import { getPatientById } from "@/lib/db/queries";
import { NextResponse } from "next/server";








export async function GET(request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth();

    if (!session?.user?.id) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {

        const patient = await getPatientById({ id });

        return NextResponse.json(
            patient,
            { status: 200 }
        );




    } catch (error) {
        console.error('Failed to fetch users:', error);
        return new Response('Failed to fetch users', { status: 500 });
    }
}
