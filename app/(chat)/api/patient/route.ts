import { auth } from "@/app/(auth)/auth";
import { getUserById, updateUser } from "@/lib/db/queries";
import { User } from "@/lib/db/schema";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";







export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {


        if (session?.user?.id) {
            const user = await getUserById({ id: session?.user.id });
            if (!user) {
                return new Response('User not found', { status: 404 });
            }
            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;
            return new Response(JSON.stringify(userWithoutPassword), {
                headers: { 'Content-Type': 'application/json' },
            });
        }



    } catch (error) {
        console.error('Failed to fetch users:', error);
        return new Response('Failed to fetch users', { status: 500 });
    }
}

const answerSchema = z.object({
    promptId: z.string(),
    question: z.string(),
    answer: z.string().optional(),
})

const UpdatePatientDataSchema = z.object({
    id: z.string().uuid(),
    // Basic user fields
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    profilePicture: z.string().optional(),
    // Patient details
    patientDetails: z.object({
        about: z.string().optional(),
        age: z.string().optional(),
        sex: z.string().optional(),
        dateOfBirth: z.string().optional(),
        location: z.string().optional(),
        education: z.string().optional(),
        work: z.string().optional(),
        fallRisk: z.enum(['yes', 'no']).optional(),

        promptAnswers: z.array(answerSchema).optional(),
        likes: z.string().optional(),
        dislikes: z.string().optional(),
        symptoms: z.string().optional(),
        avatar: z.string().optional(),
    }).optional(),
});

export async function PUT(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'User Not found' },
                { status: 400 }
            );
        }

        // Parse FormData from request body
        const formData = await req.formData();
        const existingUser = await getUserById({ id });
        if (!existingUser) {
            return new Response('User not found', { status: 404 });
        }
        // Basic user fields

        const email = (formData.get('email') as string) || existingUser.email as string;
        const password = formData.get('password') || existingUser.password as string | null;
        const name = (formData.get('name') as string) || existingUser.name;
        const role = formData.get('role') || existingUser.role as User['role'];
        const profilePicture = formData.get('profilePicture') as File | null;
        const isActive = formData.get('isActive') === 'true';
        let profilePictureUrl = existingUser.profilePicture;
        if (profilePicture) {
            const blob = await put(`profiles/${Date.now()}-${profilePicture.name}`, profilePicture, {
                access: 'public',
            });
            profilePictureUrl = blob.url;
        }
        // Patient details fields
        const patientDetails = {
            about: formData.get('about') as string || '',
            age: formData.get('age') as string || '',
            sex: formData.get('sex') as string || '',
            dateOfBirth: formData.get('dateOfBirth') as string || '',
            location: formData.get('location') as string || '',
            education: formData.get('education') as string || '',
            work: formData.get('work') as string || '',
            fallRisk: (formData.get('fallRisk') as string || 'no') as 'yes' | 'no',
            promptAnswers: JSON.parse(formData.get('promptAnswers') as string),
            likes: formData.get('likes') as string || '',
            dislikes: formData.get('dislikes') as string || '',
            symptoms: formData.get('symptoms') as string || '',
            avatar: formData.get('avatar') as string || ''
        };

        // Convert FormData to a regular object


        const hasPatientDetails = Object.values(patientDetails).some(value => value !== '');



        const updatedUser = await updateUser({
            ...existingUser,
            id,
            email,

            name,
            role: existingUser.role, // Only admins can change roles
            profilePicture: profilePictureUrl,
            isActive: existingUser.isActive,
            updatedAt: new Date(),
            patientDetails: hasPatientDetails ? patientDetails : null // Only include if details were provided
        });


        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('API Error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
