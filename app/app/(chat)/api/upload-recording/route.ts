// @ts-nocheck
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { Buffer } from 'buffer';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { unlink } from 'fs/promises';
import { parseGeminiResponse } from '@/utils/parseGeminiResponse';

// Configure API settings
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

// Generation config remains the same
const generationConfig = {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 8192,
};

const SUPPORTED_AUDIO_FORMATS = [
    'audio/wav',
    'audio/mpeg',
    'audio/mp4',
    'audio/x-m4a',
    'audio/ogg'
];

function validateAudioFile(file: File) {
    if (!file) {
        throw new Error('No file provided');
    }

    if (!SUPPORTED_AUDIO_FORMATS.includes(file.type)) {
        throw new Error(`Unsupported audio format. Supported formats: ${SUPPORTED_AUDIO_FORMATS.join(', ')}`);
    }

    const MAX_FILE_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 25MB limit');
    }
}

async function saveFileToDisk(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tempDir = os.tmpdir();
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = join(tempDir, fileName);

    await writeFile(filePath, buffer);
    return filePath;
}

async function uploadToGemini(filePath: string, mimeType: string, displayName: string) {
    try {
        // Upload the file to Gemini
        const uploadResult = await fileManager.uploadFile(filePath, {
            mimeType: mimeType,
            displayName: displayName,
        });

        // Wait for file processing
        let file = await fileManager.getFile(uploadResult.file.name);
        while (file.state === FileState.PROCESSING) {
            // Wait for 2 seconds before checking again
            await new Promise((resolve) => setTimeout(resolve, 2000));
            file = await fileManager.getFile(uploadResult.file.name);
        }

        if (file.state === FileState.FAILED) {
            throw new Error("Audio processing failed on Gemini servers");
        }

        return uploadResult.file;
    } catch (error) {
        console.error('Error in uploadToGemini:', error);
        throw new Error(`Failed to upload to Gemini: ${error?.message}`);
    }
}

async function analyzeAudio(geminiFile: any) {
    try {


        const prompt = `You are an expert call analyzer. Your task is to process healthcare call transcripts and provide a structured analysis in JSON format. Follow these specific guidelines:

1. FLAGGING CRITERIA - Mark a call as flagged (is_flagged: true) ONLY if ANY of these critical situations are present:
- ACTIVE/CURRENT severe symptoms requiring immediate attention (severe pain, difficulty breathing, etc.)
- URGENT medical concerns expressed with distress
- IMMEDIATE safety risks requiring intervention 
- ACUTE mental health crisis or severe distress
- URGENT access barriers preventing critical care
- EXPLICIT requests for emergency medical attention
- UNCONTROLLED chronic conditions causing significant problems
- SUDDEN or SEVERE new symptoms causing concern

DO NOT flag for:
- Routine mentions of past symptoms
- Well-managed chronic conditions  
- Minor discomforts
- General health questions
- Routine appointment scheduling
- Medication refill requests
- General wellness discussions

2. Create a JSON response with the following structure:
{
"call_summary": "Brief 2-3 sentence overview of the most important aspects of the call",
"is_flagged": boolean,
"key_points": [
  "List of 3-5 most important points discussed",
  "Each point should be a complete, clear statement"
],
"overall_sentiment": {
  "rating": "positive/negative/neutral", 
  "description": "Detailed explanation of patient's emotional state and satisfaction level"
},
"alert_summary": {
  // Only include if is_flagged is true
  "alert_type": "Type of alert (e.g., 'Severe Symptoms', 'Immediate Safety Risk')",
  "description": "Detailed description of the critical situation",
  "timestamp": "When the critical situation was mentioned",
  "recommended_followup": "Suggested next steps based on severity",
  "alert_message": "Short, clear reason for alert to notify moderators"
},
"call_timeline": [
  {
    "timestamp": "MM:SS-MM:SS",
    "discussion_points": [
      "Key topics discussed in this time segment"
    ]
  }
],
"conversation_metrics": {
  "userSpeakingTime": "Total time user spoke (in seconds)",
  "avatarSpeakingTime": "Total time agent/avatar spoke (in seconds)", 
  "turnsCount": "Total number of conversation turns",
  "avgResponseTime": "Average time taken for responses (in seconds)"
}
}

3. Alert Types and Follow-up Guidelines:
- Severe Symptoms -> Assess level and direct to appropriate care (self-care, PCP, urgent care, emergency)
- Safety Risks -> Immediate escalation to care team
- Mental Health Crisis -> Crisis resources or immediate provider contact  
- Access Barriers -> Urgent care coordination team referral

4. For sentiment analysis, consider:
- Patient's tone and word choice
- Expression of satisfaction/dissatisfaction
- Changes in mood throughout the call
- Level of engagement

5. When documenting alerts:
- Include specific symptoms or concerns mentioned
- Note the severity level
- Document any immediate actions taken
- Include relevant quotes from the conversation
- Specify timing of symptom onset if mentioned

6. Ensure the response is valid JSON that can be parsed programmatically. Always include the alert_summary when is_flagged is true, with a concise alert_message for moderators. Extract and include conversation metrics for every call.`

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { responseMimeType: "application/json" },
            systemInstruction: prompt
        });
        const result = await model.generateContent([
            prompt,
            {
                fileData: {
                    fileUri: geminiFile.uri,
                    mimeType: geminiFile.mimeType,
                }
            }
        ]);
        // Example usage:
        try {
            console.log('gemini response', result.response)
            const analysisResult = parseGeminiResponse(result.response.text());
            return analysisResult
        } catch (error) {
            console.error('Failed to parse response:', error);
            return result.response.text();

        }

    } catch (error) {
        console.error('Error in analyzeAudio:', error);
        throw new Error(`Failed to analyze audio: ${error?.message}`);
    }
}

export async function POST(req: Request) {
    console.log('Starting audio analysis request');
    let tempFilePath: string | null = null;

    try {
        const formData = await req.formData();
        const file = formData.get('audio') as File;

        // Validate file
        validateAudioFile(file);

        // Log request details
        console.log('[Audio Analysis] Processing file:', {
            timestamp: new Date().toISOString(),
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        });

        // Save file to disk temporarily
        tempFilePath = await saveFileToDisk(file);

        // Upload to both services
        const [blobUpload, geminiFile] = await Promise.all([
            put(file.name, file, { access: 'public' }),
            uploadToGemini(tempFilePath, file.type, file.name)
        ]);

        // Analyze the audio
        const analysis = await analyzeAudio(geminiFile);

        return NextResponse.json({
            success: true,
            url: blobUpload.url,
            analysis: analysis
        });

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({
            success: false,
            error: error?.message || 'Internal server error'
        }, {
            status: error?.message.includes('No file provided') ? 400 : 500
        });
    } finally {
        // Clean up temporary file
        if (tempFilePath) {
            try {
                await unlink(tempFilePath);
            } catch (error) {
                console.error('Error deleting temporary file:', error);
            }
        }
    }
}