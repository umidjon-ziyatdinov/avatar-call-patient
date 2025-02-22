
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { promptTemplate } from '../schema'; // Adjust the path based on your project structure
// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

const avatarPrompts = [
    "What is the avatar’s full name, and does the patient have a special nickname for them?",
    "What are some of the patient’s fondest memories with this avatar?",
    "What was the avatar like as a child, and how did the patient describe their personality growing up?",
    "What special activities did the patient and avatar love doing together?",
    "Can you share a specific heartwarming or funny story about the patient and the avatar?",
    "Has the avatar and the patient ever shared an inside joke, funny phrase, or unique way of communicating?",
    "What life milestones has the avatar reached that the patient was proud of?",
    "How did the patient express love, pride, or concern for this avatar?",
    "Where does the avatar live now, and how has their life changed over time?",
    "What pets does the avatar have, and did the patient ever meet them?",
    "What are the avatar’s passions, hobbies, or interests that the patient might like to hear about?",
    "If the avatar could spend one perfect day with the patient, what would it look like?",
    "What are some major challenges or struggles the avatar has gone through, and how did the patient support them?",
    "How does the avatar typically greet the patient or start conversations?",
    "What are some traditions or routines they had together?",
    "What is one piece of wisdom or advice the patient gave to the avatar that they will never forget?",
    "Has the avatar and the patient ever traveled together?",
    "If the avatar could send a message to the patient right now, what would it be?"
];

async function seedPromptTemplates() {
    try {
        await db.insert(promptTemplate).values(
            avatarPrompts.map((question, index) => ({
                question,
                orderNumber: index + 1,
                isActive: true,
                type: 'avatar' as const,
            }))
        );
        console.log('Prompt templates seeded successfully!');
    } catch (error) {
        console.error('Error seeding prompt templates:', error);
    }
}

seedPromptTemplates();
