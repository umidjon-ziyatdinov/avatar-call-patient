import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { promptTemplate } from './schema';

config({
  path: '.env.local',
});
const userPrompts = [
  "What are some of the most cherished childhood memories they have?",
  "Can you tell a detailed story about a favorite family tradition they always loved?",
  "What was their career or profession, and what did they love most about it?",
  "How did they meet their spouse or closest loved one, and what was their love story like?",
  "What are some stories about their children or grandchildren that bring them the most joy?",
  "What are their favorite stories about their pets?",
  "Can you share a story about a time they overcame a major challenge in life?",
  "What kind of music do they love, and do they have any favorite concerts or performances they attended?",
  "What were their favorite movies or TV shows, and what made them special?",
  "What was their most memorable vacation or travel experience?",
  "What hobbies or creative activities have they been passionate about?",
  "What was their favorite meal, and do you have a special story about them cooking or eating it?",
  "What was a defining moment in their life that they often spoke about?",
  "Can you tell a funny or embarrassing story about them that they always laughed about?",
  "What holidays or celebrations were most meaningful to them, and how did they celebrate?",
  "What is a piece of advice or wisdom they always shared with family or friends?",
  "What historical events had the biggest impact on their life, and how did they experience them?",
  "What was their dream job or passion if they could have done anything in life?",
  "What are some of their proudest achievements, big or small?",
  "If they could relive one perfect day from their past, what do you think it would be and why?",
];
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
  "If the avatar could send a message to the patient right now, what would it be?",
];
const seedPromptTemplates = async (db: ReturnType<typeof drizzle>) => {
  console.log('🌱 Seeding prompt templates...');

  try {
    await db.insert(promptTemplate).values([
      ...avatarPrompts.map((question, index) => ({
        question,
        orderNumber: index + 1,
        isActive: true,
        type: 'avatar' as const,
      })),
      ...userPrompts.map((question, index) => ({
        question,
        orderNumber: avatarPrompts.length + index + 1,
        isActive: true,
        type: 'patient' as const,
      })),
    ]);
    console.log('✅ Seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding prompt templates:', error);
  }
};
const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined');
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  console.log('⏳ Running migrations...');

  const start = Date.now();
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  const end = Date.now();
  // await seedPromptTemplates(db)
  console.log('✅ Migrations completed in', end - start, 'ms');
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
