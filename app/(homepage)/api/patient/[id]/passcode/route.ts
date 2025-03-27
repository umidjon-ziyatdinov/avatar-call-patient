import { NextResponse } from "next/server";
import * as bcrypt from 'bcrypt-ts';
import { z } from "zod";
import { getPatientById, updatePatient } from "@/lib/db/query/patientQuery";
import { getUserById, updateUser } from "@/lib/db/queries";

// Passcode validation schema
const passcodeSchema = z.object({
    newPasscode: z.string()
        .length(4, "Passcode must be exactly 6 digits")
        .regex(/^\d+$/, "Passcode must contain only numbers"),
});

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await req.json();
        const { id } = await params;

        // Validate request body

        const passcodeValidation = passcodeSchema.safeParse(body);

        if (!passcodeValidation.success) {
            return NextResponse.json(
                { error: passcodeValidation.error.errors[0].message },
                { status: 400 }
            );
        }


        if (passcodeValidation.success) {
            const { newPasscode } = passcodeValidation.data;

            // Get patient from database
            const patientRecord = await getPatientById({ id });

            if (!patientRecord) {
                return NextResponse.json({ error: "Patient not found" }, { status: 404 });
            }

            const user = await getUserById({ id: patientRecord.userId })
            // Hash new passcode

            // Update passcode in database
            await updateUser({
                ...user,
                passcode: parseInt(newPasscode, 10),
                updatedAt: new Date()

            });

            return NextResponse.json(
                { message: "Security passcode updated successfully" },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Password or passcode change error:", error);
        return NextResponse.json(
            { error: "Failed to update password or security passcode" },
            { status: 500 }
        );
    }
}