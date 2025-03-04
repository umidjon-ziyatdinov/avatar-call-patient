import { auth } from "@/app/(auth)/auth";
import { getUserById, updateUser } from "@/lib/db/queries";
import { getPatientById, updatePatient } from "@/lib/db/query/patientQuery";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PUT(req: Request) {
    try {
        const session = await auth()

        if (!session?.user.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }


        // Parse FormData from request body
        const formData = await req.formData();
        const existingPatient = await getPatientById({ id: session.user.id });
        const existingUser = await getUserById({ id: existingPatient.userId });
        if (!existingUser) {
            return new Response('User not found', { status: 404 });
        }
        // Basic user fields

        const passcode = (formData.get('passcode') as string);

        const profilePicture = formData.get('profilePicture') as File | null;

        let profilePictureUrl = existingUser.profilePicture;
        if (profilePicture) {
            const blob = await put(`profiles/${Date.now()}-${profilePicture.name}`, profilePicture, {
                access: 'public',
            });
            profilePictureUrl = blob.url;
        }
        // Patient details fields
        const patientDetails = {
            name: formData.get('name') as string || '',
            about: formData.get('about') as string || '',
            age: formData.get('age') as string || '',
            sex: formData.get('gender') as string || '',
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
            passcode: parseInt(passcode, 10)
        });

        const updatedPatient = await updatePatient({ id: session.user.id, data: { ...patientDetails, onboadringComplete: true, profilePicture: profilePictureUrl } })


        return NextResponse.json({ user: updatedUser, patient: updatedPatient });
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