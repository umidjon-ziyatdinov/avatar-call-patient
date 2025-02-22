// app/api/avatars/[id]/route.ts
import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { getAvatarById, updateAvatar } from '@/lib/db/queries';

import { z } from 'zod';
import { InteractionPrompts } from '@/types/enums';
import { createAvatarSchema } from '@/types/avatarValidation';

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

        return NextResponse.json(avatar);
    } catch (error) {
        console.error(`GET /api/avatars/${id} error:`, error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        // First check if avatar exists
        const existingAvatar = await getAvatarById({ id });

        if (!existingAvatar) {
            return NextResponse.json(
                { error: 'Avatar not found' },
                { status: 404 }
            );
        }

        // Get JSON data from request body
        const jsonData = await request.json();

        // No need to handle file upload as we're preserving the existing image
        // Ensure we're using the existing avatar image URL
        const avatarUrl = existingAvatar.avatarImage;

        // Combine the data with the existing avatar image
        const updateData = {
            ...jsonData,
            avatarImage: avatarUrl // Preserve existing image URL
        };

        // Remove undefined/null values to allow partial updates
        const cleanedData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== null)
        );

        // Validate the data with partial schema


        // Update avatar in database
        const updatedAvatar = await updateAvatar({
            id,
            data: { ...existingAvatar, ...cleanedData }
        });

        if (!updatedAvatar) {
            return NextResponse.json(
                { error: 'Failed to update avatar' },
                { status: 500 }
            );
        }

        return NextResponse.json(updatedAvatar);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        console.error(`PATCH /api/avatars/${id} error:`, error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}