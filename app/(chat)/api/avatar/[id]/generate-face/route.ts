import { getAvatarById, updateAvatar } from "@/lib/db/queries";
import { NextResponse } from "next/server";

async function generateFaceId(charachterId: string) {
    try {
        // Track request start
        console.log(`[Simli] Starting face generation for ${charachterId}`, {
            timestamp: new Date().toISOString(),
            charachterId: charachterId,
        });

        if (!charachterId) return;

        const apiKey = process.env.NEXT_PUBLIC_SIMLI_API_KEY;
        if (!apiKey) throw new Error("NEXT_PUBLIC_SIMLI_API_KEY is not defined");

        const response = await fetch(`https://api.simli.ai/getRequestStatus?face_id=${charachterId}`, {
            method: "POST",
            headers: {
                'api-key': apiKey,
            } as Record<string, string>
        });

        const simliResult = await response.json();

        // Track API response
        console.log(`[Simli] Received response for ${charachterId}`, {
            timestamp: new Date().toISOString(),
            status: response.status,
            response: simliResult
        });

        if (!response.ok) {
            console.error("[Simli] API error:", {
                status: response.status,
                error: simliResult.error || simliResult?.detail,
                charachterId
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
                warnings: simliResult.warnings,
                characterUid: simliResult.character_uid
            });
        }

        if (simliResult.status === 'processing') {
            return {
                simliStatus: "processing",
                simliCharacterId: null,
                error: "Face generation is in progress. This typically takes 5-10 minutes. Please try again in a few minutes."
            };
        }

        return {
            simliStatus: "success",
            faceId: simliResult.face_id,
        };
    } catch (error) {
        console.error("[Simli] Error in generateCharacter:", {
            error,
            charachterId,
            timestamp: new Date().toISOString()
        });
        return {
            simliStatus: "error",
            simliCharacterId: null,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const avatar = await getAvatarById({ id });

        if (!avatar) {
            return NextResponse.json(
                { error: 'Avatar not found' },
                { status: 404 }
            );
        }

        // Check if face generation is needed
        if (!avatar.isActive && avatar.simliCharacterId) {
            const simliResult = await generateFaceId(avatar.simliCharacterId);

            switch (simliResult?.simliStatus) {
                case 'success':
                    const updatedAvatar = await updateAvatar({
                        id: avatar.id,
                        data: {
                            ...avatar,
                            simliFaceId: simliResult.faceId,
                            isActive: true
                        }
                    });

                    if (updatedAvatar) {
                        return NextResponse.json(updatedAvatar);
                    }
                    break;

                case 'processing':
                    return NextResponse.json(
                        {
                            id: avatar.id,
                            status: 'processing',
                            message: 'Face generation is in progress. This typically takes 5-10 minutes. Please try again in a few minutes.',
                            avatar: avatar
                        },
                        { status: 202 } // 202 Accepted indicates the request is being processed
                    );

                case 'error':
                    return NextResponse.json(
                        {
                            error: simliResult.error || 'Face generation failed',
                            avatar: avatar
                        },
                        { status: 400 }
                    );

                default:
                    return NextResponse.json(
                        {
                            error: 'Unknown status from face generation service',
                            avatar: avatar
                        },
                        { status: 400 }
                    );
            }
        }

        // Return the avatar if it's already active or doesn't need face generation
        return NextResponse.json(avatar);

    } catch (error) {
        console.error(`GET /api/avatars/${id} error:`, error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}