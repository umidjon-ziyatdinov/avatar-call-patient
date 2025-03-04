
import { eq } from "drizzle-orm";
import { NewPatient, patient, UpdatePatient } from "../schema";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function createPatient(data: NewPatient) {
    try {
        const [newPatient] = await db
            .insert(patient)
            .values({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .returning();

        return newPatient;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
}


export async function getPatientById({ id }: { id: string }) {
    console.log('userId', id)
    try {
        const [foundUser] = await db
            .select()
            .from(patient)
            .where(eq(patient.id, id))
            .limit(1);

        return foundUser || null;
    } catch (error) {
        console.error('Error getting user by id:', error);
        throw new Error('Failed to get user');
    }
}


export async function updatePatient({
    id,
    data
}: { id: string, data: UpdatePatient }) {
    try {
        const [updatedUser] = await db
            .update(patient)
            .set({
                ...data,
                updatedAt: new Date()
            })
            .where(eq(patient.id, id))
            .returning();

        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user');
    }
}