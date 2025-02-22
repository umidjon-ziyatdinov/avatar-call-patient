// @ts-nocheck
import { createAvatar, getAllAvatars, getAllAvatarsForAdmin, getAvatarsByUser } from '@/lib/db/queries';
import { InteractionPrompts, OpenAIModels, OpenAIVoices } from '@/types/enums';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { z } from 'zod';
import { auth } from '@/app/(auth)/auth';

const personalitySchema = z.object({
    memoryEngagement: z.number().min(0).max(100),
    anxietyManagement: z.number().min(0).max(100),
    activityEngagement: z.number().min(0).max(100),
    socialConnection: z.number().min(0).max(100)
});

const createAvatarSchema = z.object({
    name: z.string().min(1, "Name is required").max(64, "Name is too long"),
    role: z.string().min(1, "Role is required").max(64, "Role is too long"),
    avatarImage: z.string().url("Invalid avatar URL"),
    about: z.string().default(''),
    age: z.coerce.number().min(0).max(150).default(0),
    sex: z.string().max(16).default(''),
    education: z.string().default(''),
    work: z.string().default(''),
    prompt1: z.enum(InteractionPrompts, {
        errorMap: () => ({ message: "Invalid prompt selection" })
    }).default('family'),
    prompt2: z.enum(InteractionPrompts, {
        errorMap: () => ({ message: "Invalid prompt selection" })
    }).default('daily'),
    prompt3: z.enum(InteractionPrompts, {
        errorMap: () => ({ message: "Invalid prompt selection" })
    }).default('memories'),
    personality: personalitySchema.default({
        memoryEngagement: 50,
        anxietyManagement: 50,
        activityEngagement: 50,
        socialConnection: 50
    }),
    openaiVoice: z.enum(OpenAIVoices, {
        errorMap: () => ({ message: "Invalid OpenAI voice" })
    }).default('alloy'),
    openaiModel: z.enum(OpenAIModels, {
        errorMap: () => ({ message: "Invalid OpenAI model" })
    }).default('gpt-4o-realtime-preview'),

    initialPrompt: z.string().min(1, "Initial prompt is required"),
    isActive: z.boolean().default(false)
});

function parseFormData(formData: FormData) {
    const data: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
        if (key === 'personality') {
            data[key] = JSON.parse(value as string);
        } else if (key === 'age') {
            data[key] = parseInt(value as string, 10);
        } else {
            data[key] = value;
        }
    }

    return data;
}

export async function GET(
    request: Request,

) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return new Response('Unauthorized', { status: 401 });
        }
        const { searchParams } = new URL(request.url);
        const isAdmin = searchParams.get('isAdmin');
        if (isAdmin) {
            const avatars = await getAllAvatarsForAdmin(session?.user?.id);
            return NextResponse.json(avatars);
        }
        const avatars = await getAvatarsByUser(session?.user?.id, true);
        return NextResponse.json(avatars);
    } catch (error) {
        console.error('GET /api/avatars error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
interface SimliResponse {
    message: string;
    character_uid: string;
    warnings?: string[];
    error?: string;
}

interface GenerateCharacterResult {
    simliStatus: "success" | "error";
    simliCharacterId: string | null;
    warnings?: string[];
    error?: string;
}

async function generateCharacter({ name, image }: { name: string; image: File }): Promise<GenerateCharacterResult> {
    try {
        const formData = new FormData();
        formData.append("image", image);

        // Track request start
        console.log(`[Simli] Starting face generation for ${name}`, {
            timestamp: new Date().toISOString(),
            fileSize: image.size,
            fileType: image.type
        });

        const response = await fetch(`https://api.simli.ai/generateFaceID?face_name=${name}`, {
            method: "POST",
            headers: {
                'api-key': process.env.NEXT_PUBLIC_SIMLI_API_KEY,
                // Remove Content-Type header - let it be set automatically
            },
            body: formData,
        });

        const simliResult = await response.json() as SimliResponse;

        // Track API response
        console.log(`[Simli] Received response for ${name}`, {
            timestamp: new Date().toISOString(),
            status: response.status,
            response: simliResult
        });

        if (!response.ok) {
            console.error("[Simli] API error:", {
                status: response.status,
                error: simliResult.error || simliResult?.detail,  // Include detail field in error logging
                name
            });
            return {
                simliStatus: "error",
                simliCharacterId: null,
                error: simliResult.error || simliResult.detail || "Failed to generate character"
            };
        }

        // Handle successful response with warnings
        if (simliResult.warnings?.length) {
            console.warn("[Simli] Generation warnings:", {
                name,
                warnings: simliResult.warnings,
                characterUid: simliResult.character_uid
            });
        }

        return {
            simliStatus: "success",
            simliCharacterId: simliResult.character_uid,
            warnings: simliResult.warnings
        };
    } catch (error) {
        console.error("[Simli] Error in generateCharacter:", {
            error,
            name,
            timestamp: new Date().toISOString()
        });
        return {
            simliStatus: "error",
            simliCharacterId: null,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required." },
                { status: 401 }
            );
        }
        const formData = await request.formData();
        const avatarFile = formData.get("avatarFile") as File | null;

        // Validate file existence and type
        if (!avatarFile || !avatarFile.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Invalid or missing image file." },
                { status: 400 }
            );
        }

        // Validate file size
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (avatarFile.size > maxSize) {
            return NextResponse.json(
                { error: "File size too large. Maximum is 5MB." },
                { status: 400 }
            );
        }

        // Upload file to storage
        const blob = await put(`${formData.get("name")} - ${Date.now()}`, avatarFile, {
            access: "public",
            addRandomSuffix: true,
        });
        const avatarUrl = blob.url;

        // Parse and validate personality data
        const parsedData = Object.fromEntries(formData.entries());
        if (parsedData.personality) {
            try {
                parsedData.personality = JSON.parse(parsedData.personality);
            } catch {
                return NextResponse.json(
                    { error: "Invalid personality JSON." },
                    { status: 400 }
                );
            }
        }

        const data = {
            ...parsedData,
            avatarImage: avatarUrl,
        };

        // Validate data against schema
        const validatedData = createAvatarSchema.parse(data);

        // Check authentication


        // Generate face ID
        const simliResponse = await generateCharacter({
            name: validatedData.name,
            image: avatarFile
        });

        // Handle Simli API failures
        if (simliResponse.simliStatus === "error") {
            return NextResponse.json({
                error: "Failed to generate character face",
                details: simliResponse.error,
                status: "error"
            }, { status: 400 });
        }

        // Create avatar only if face generation was successful
        const newAvatar = await createAvatar({
            ...validatedData,
            simliFaceId: null,
            simliCharacterId: simliResponse.simliCharacterId,
            userId: session?.user?.role === 'admin' ? null : session.user.id,
        });

        // Prepare response with detailed information
        const response = {
            status: "success",
            avatar: newAvatar,
            simli: {
                characterId: simliResponse.simliCharacterId,
                warnings: simliResponse.warnings,
                status: "processing"
            },
            message: `Avatar created successfully! The character_uid (${simliResponse.simliCharacterId}) has been assigned to your avatar. This ID is important as it will be used to:
1. Track the face generation progress
2. Link the generated face to your avatar
3. Enable future face-related features

The face generation has been queued and will be processed shortly. You can:
- Use this avatar immediately with a default face
- Wait for the face generation to complete (typically takes 1-2 minutes)
- Check the face generation status using the character_uid
`,
            nextSteps: [
                "You can start using your avatar immediately with default settings",
                "The custom face will be automatically updated once generation is complete",
                "Keep the character_uid for reference if needed"
            ]
        };

        return NextResponse.json(response, { status: 201 });

    } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: "Invalid request data",
                    details: error.errors,
                    status: "error"
                },
                { status: 400 }
            );
        }

        // Handle unexpected errors
        console.error("POST /api/avatars error:", error);
        return NextResponse.json(
            {
                error: "Internal Server Error",
                status: "error"
            },
            { status: 500 }
        );
    }
}