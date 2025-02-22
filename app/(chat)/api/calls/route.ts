import { auth } from "@/app/(auth)/auth";
import { createNewCall, getAllCallsByUserId, getCallByUserAndAvatarId } from "@/lib/db/queries";
import { NextResponse } from "next/server";
import { z } from "zod";

const createCallSchema = z.object({
    avatarId: z.string().uuid(),
    status: z.enum(['active', 'completed', 'failed', 'missed']),
    qualityMetrics: z.object({
        audioQuality: z.number(),
        videoQuality: z.number(),
        networkLatency: z.number(),
        dropouts: z.number(),
    }),
    conversationMetrics: z.object({
        userSpeakingTime: z.number(),
        avatarSpeakingTime: z.number(),
        turnsCount: z.number(),
        avgResponseTime: z.number(),
    }),
    prompt: z.string().optional(),

    technicalDetails: z.object({
        browserInfo: z.string(),
        deviceType: z.string(),
        networkType: z.string(),
        osVersion: z.string(),
        startTime: z.string(),
    }),

    metadata: z.record(z.any()).optional(),
});

;


export async function POST(request: Request) {
    try {
        const json = await request.json();
        const validatedData = createCallSchema.parse(json);

        // Get user ID from session
        const session = await auth();
        if (!session?.user.id) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
            });
        }

        const newCall = await createNewCall({
            userId: session.user.id,
            avatarId: validatedData.avatarId,
            status: validatedData.status,
            qualityMetrics: validatedData.qualityMetrics,
            conversationMetrics: validatedData.conversationMetrics,
            technicalDetails: validatedData.technicalDetails,
            metadata: validatedData.metadata,
            // Set default values for optional fields
            prompt: validatedData.prompt || '',
            duration: 0,
            transcriptUrl: '',
            recordingUrl: '',
            errorLogs: [],
            createdAt: new Date(),
            analysis: {},
            endedAt: null
        });

        return new Response(JSON.stringify(newCall), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error creating call:', error);
        if (error instanceof z.ZodError) {
            // Log the specific validation errors
            console.error('Validation errors:', error.errors);
            return new Response(JSON.stringify({
                error: 'Invalid request data',
                details: error.errors
            }), {
                status: 400,
            });
        }
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
        });
    }
}



// Define types for better type safety
interface Call {
    id: string;
    userId: string;
    avatarId: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    status: 'completed' | 'failed' | 'ongoing';
    // Add other relevant call properties
}

// Input validation schema
const QuerySchema = z.object({
    avtarId: z.string().optional(),
    isAdmin: z.string().optional(),
});

export async function GET(request: Request) {
    try {
        // 1. Authenticate user
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse(
                JSON.stringify({ error: 'Authentication required' }),
                { status: 401 }
            );
        }

        // 2. Parse and validate query parameters
        const { searchParams } = new URL(request.url);

        const params = {
            avatarId: searchParams.get('avatarId'),
            isAdmin: searchParams.get('isAdmin'),
        }

        const { avatarId, isAdmin } = params;

        // 3. Get call history
        try {

            if (avatarId && (avatarId !== null)) {
                const calls = await getCallByUserAndAvatarId({
                    id: session.user.id,
                    avatarId: avatarId!,
                });
                return NextResponse.json({
                    success: true,
                    data: calls,
                    total: calls.length
                });
            }
            const calls = await getAllCallsByUserId(session.user.id);
            return NextResponse.json({
                success: true,
                data: calls,
                total: calls.length
            });

            // 4. Transform and sort calls if needed
            // const processedCalls = calls
            //     .sort((a, b) => new Date(b.technicalDetails?.startTime).getTime() - new Date(a?.technicalDetails?.startTime).getTime())
            //     .map(call => ({
            //         ...call,
            //         duration: call.endTime 
            //             ? new Date(call.endTime).getTime() - new Date(call.startTime).getTime() 
            //             : undefined
            //     }));

            // 5. Return successful response
            return NextResponse.json({
                success: true,
                data: calls,
                total: calls.length
            });

        } catch (dbError) {
            console.error('Database error:', dbError);
            return new NextResponse(
                JSON.stringify({ error: 'Failed to fetch call history' }),
                { status: 500 }
            );
        }

    } catch (error) {
        // Log the full error for debugging
        console.error('Unexpected error in GET /api/calls:', error);

        // Return a safe error response
        return new NextResponse(
            JSON.stringify({
                error: 'An unexpected error occurred',
                message: error instanceof Error ? error.message : 'Unknown error'
            }),
            { status: 500 }
        );
    }
}