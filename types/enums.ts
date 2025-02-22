export const OpenAIVoices = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'sage', 'shimmer', 'verse'] as const;
export type OpenAIVoice = typeof OpenAIVoices[number];

export const OpenAIModels = ["gpt-4o-realtime-preview",
    "gpt-4o-realtime-preview-2024-12-17",
    "gpt-4o-realtime-preview-2024-10-01",
    "gpt-4o-mini-realtime-preview-2024-12-17",
    "gpt-4o-mini-realtime-preview"] as const;
export type OpenAIModel = typeof OpenAIModels[number];

export const InteractionPrompts = ['family', 'hobbies', 'music', 'daily', 'memories', 'exercise', 'cognitive'] as const;
export type InteractionPrompt = typeof InteractionPrompts[number];
