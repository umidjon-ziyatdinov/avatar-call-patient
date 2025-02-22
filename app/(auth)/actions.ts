'use server';

import { z } from 'zod';
import * as bcrypt from 'bcrypt-ts';
import { createUser, getUser } from '@/lib/db/queries';
import { put } from '@vercel/blob';
import { signIn, signOut } from './auth';
import { redirect } from 'next/navigation';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  passcode: z.string().regex(/^\d{4}$/),
  name: z.string().min(2).max(128),
  avatar: z.instanceof(Blob).optional(),
});
const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),

});

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = LoginFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};
export async function handleSignOut() {
  try {
    await signOut();

    return { success: true }
  } catch (error) {
    console.error('Sign out error:', error)
    return { success: false, error: 'Failed to sign out' }
  }
}
// Update the RegisterActionState type
export type RegisterActionState =
  | { status: 'idle' }
  | { status: 'user_exists' }
  | { status: 'invalid_data'; errors?: { field: string; message: string }[] }
  | { status: 'failed' }
  | { status: 'success' };




export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    // Get all form fields
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
      passcode: formData.get('passcode'),
      name: formData.get('name'),
      avatar: formData.get('avatar'),
    };

    // Validate the form data
    const validatedData = authFormSchema.parse({
      email: rawData.email,
      password: rawData.password,
      passcode: rawData.passcode,
      name: rawData.name,
      avatar: rawData.avatar instanceof Blob ? rawData.avatar : undefined,
    });

    // Check if user already exists
    const [existingUser] = await getUser(validatedData.email);
    if (existingUser) {
      return { status: 'user_exists' };
    }

    // Handle profile picture upload
    let profilePictureUrl = '/images/default-profile.png';

    if (validatedData.avatar) {
      try {
        const filename = `${validatedData.email}-${Date.now()}`;
        const blob = await put(filename, validatedData.avatar, {
          access: 'public',
          addRandomSuffix: true,
          // You can add content type validation here
          contentType: validatedData.avatar.type,
        });
        profilePictureUrl = blob.url;
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
        // Continue with registration even if image upload fails
        // You might want to return a specific status if image upload is crucial
      }
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user with all fields
    await createUser({
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name,
      passcode: parseInt(validatedData.passcode, 10),
      role: 'user',
      profilePicture: profilePictureUrl,
      isActive: true,
      patientDetails: null,
      lastLoginAt: null,
      verifiedAt: null,
    });

    // Sign in the user
    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };

  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof z.ZodError) {
      // You might want to return more specific validation errors
      return {
        status: 'invalid_data',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }

    return { status: 'failed' };
  }
};

