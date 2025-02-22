import { z } from "zod";
import { InteractionPrompts, OpenAIModels, OpenAIVoices } from "./enums";


const personalitySchema = z.object({
    memoryEngagement: z.number().min(0).max(100),
    anxietyManagement: z.number().min(0).max(100),
    activityEngagement: z.number().min(0).max(100),
    socialConnection: z.number().min(0).max(100)
});

export const createAvatarSchema = z.object({
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