// @ts-nocheck
// app/api/calls/route.ts

import { getCallById, updateCall } from "@/lib/db/queries";
import { call } from "@/lib/db/schema";
import { z } from "zod";

interface CallTimeline {
    timestamp: string;
    discussion_points: string[];
}

interface OverallSentiment {
    rating: string;
    description: string;
}

interface AlertSummary {
    alert_type?: string;
    description?: string;
    timestamp?: string;
    recommended_followup?: string;
}


const CallAnalysisSchema = z.object({
    call_summary: z.string(),
    is_flagged: z.boolean(),
    key_points: z.array(z.string()).optional(),
    overall_sentiment: z.object({
        rating: z.string(),
        description: z.string()
    }),
    alert_summary: z.object({
        alert_type: z.string().optional(),
        description: z.string().optional(),
        timestamp: z.string().optional(),
        recommended_followup: z.string().optional()
    }).optional(),
    call_timeline: z.array(z.object({
        timestamp: z.string(),
        discussion_points: z.array(z.string())
    }))
}).optional();
const updateCallSchema = z.object({
    status: z.enum(['active', 'completed', 'failed', 'missed']).optional(),
    endedAt: z.string().datetime().optional().default(new Date().toISOString()),
    duration: z.number().optional(),
    recordingUrl: z.string().url().optional(),
    transcriptUrl: z.string().url().optional(),
    qualityMetrics: z.object({
        audioQuality: z.number(),
        videoQuality: z.number(),
        networkLatency: z.number(),
        dropouts: z.number(),
    }).optional(),
    analysis: CallAnalysisSchema,
    conversationMetrics: z.object({
        userSpeakingTime: z.number(),
        avatarSpeakingTime: z.number(),
        turnsCount: z.number(),
        avgResponseTime: z.number(),
    }).optional(),
    errorLogs: z.array(z.object({
        timestamp: z.string(),
        error: z.string(),
        context: z.string(),
    })).optional(),

});


export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const json = await request.json();
        console.log('json', json)
        const validatedData = updateCallSchema.parse(json);

        // Calculate duration if endedAt is provided but duration isn't
        let duration = validatedData.duration;
        if (validatedData.endedAt && !duration) {
            const existingCall = await getCallById({ id })

            if (existingCall?.technicalDetails?.startTime) {
                const startTime = new Date(existingCall.technicalDetails.startTime);
                const endTime = new Date(validatedData.endedAt);
                duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
            }
        }

        const updatedCall = await updateCall({
            id, data: {
                ...validatedData,
                duration,

                endedAt: validatedData.endedAt ? new Date(validatedData.endedAt) : undefined,
                // If status is being set to completed, ensure endedAt is set
                ...(validatedData.status === 'completed' && !validatedData.endedAt
                    ? { endedAt: new Date() }
                    : {}),
            }
        })
        if (!updatedCall) {
            return new Response(JSON.stringify({ error: 'Call not found' }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify(updatedCall), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error updating call:', error);
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({ error: 'Invalid request data', details: error.errors }), {
                status: 400,
            });
        }
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
        });
    }
}
