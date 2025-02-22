interface AlertSummary {
    alert_type: string;
    description: string;
    timestamp: string;
    recommended_followup: string;
}

interface OverallSentiment {
    rating: string;
    description: string;
}

interface TimelinePoint {
    timestamp: string;
    discussion_points: string[];
}

interface CallAnalysis {
    call_summary: string;
    is_flagged: boolean;
    key_points: string[];
    overall_sentiment: OverallSentiment;
    alert_summary: AlertSummary;
    call_timeline: TimelinePoint[];
}

function parseGeminiResponse(response: string): CallAnalysis {
    try {
        // Remove markdown code block syntax if present
        let cleanedResponse = response.replace(/```json\n|\n```/g, '').trim();

        // Remove any "json" prefix and trailing whitespace
        cleanedResponse = cleanedResponse.replace(/^json\s*/, '').trim();

        try {
            // First attempt: direct JSON parse
            return JSON.parse(cleanedResponse);
        } catch (error) {
            // Second attempt: handle escaped newlines and quotes
            const unescapedJson = cleanedResponse
                .replace(/\\n/g, '\n')  // Replace escaped newlines
                .replace(/\\\"/g, '"')  // Replace escaped quotes
                .replace(/^"|"$/g, ''); // Remove surrounding quotes if present

            const parsedJson = JSON.parse(unescapedJson);

            // Validate the required fields
            if (!parsedJson.call_summary || !parsedJson.key_points || !parsedJson.overall_sentiment) {
                throw new Error('Missing required fields in the response');
            }

            return parsedJson;
        }
    } catch (error) {
        console.error('Error parsing Gemini response:', error);
        throw new Error(`Failed to parse Gemini response: ${error?.message}`);
    }
}

export { parseGeminiResponse, type CallAnalysis };