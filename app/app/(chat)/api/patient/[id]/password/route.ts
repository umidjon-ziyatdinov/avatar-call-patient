import { NextResponse } from "next/server";
import * as bcrypt from 'bcrypt-ts';
import { z } from "zod";
import { patient } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPatientById, updatePatient } from "@/lib/db/query/patientQuery";

// Password validation schema
const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(4, "Password must be at least 4 characters"),
});

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await req.json();
        const { id } = await params;
        // Validate request body
        const validation = passwordChangeSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { currentPassword, newPassword } = validation.data;

        // Get patient from database
        const patientRecord = await getPatientById({ id })

        if (!patientRecord) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(
            currentPassword,
            patientRecord.password || ""
        );

        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 401 }
            );
        }

        // Check if new password is same as old password
        const isSamePassword = await bcrypt.compare(newPassword, patientRecord.password || "");
        if (isSamePassword) {
            return NextResponse.json(
                { error: "New password cannot be the same as current password" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database
        const updatedPatient = updatePatient({ id, data: { ...patientRecord, password: hashedPassword } })

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Password change error:", error);
        return NextResponse.json(
            { error: "Failed to update password" },
            { status: 500 }
        );
    }
}