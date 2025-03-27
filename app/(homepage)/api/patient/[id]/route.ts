import { auth } from "@/app/(auth)/auth";
import { getPatientById } from "@/lib/db/queries";
import { updatePatient } from "@/lib/db/query/patientQuery";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";








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



export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        const { id } = await params;
        if (!session?.user.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!id) {
            return NextResponse.json(
                { error: 'Patient Not found' },
                { status: 401 }
            );
        }


        // Parse FormData from request body
        const formData = await req.formData();
        const existingPatient = await getPatientById({ id });


        // Basic user fields


        const profilePicture = formData.get('profilePicture') as File | null;

        let profilePictureUrl = existingPatient.profilePicture;
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





        const updatedPatient = await updatePatient({ id, data: { ...existingPatient, ...patientDetails, profilePicture: profilePictureUrl } })


        return NextResponse.json(updatedPatient);
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