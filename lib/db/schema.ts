import { sql, type InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,

  boolean,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';
import { InteractionPrompts, OpenAIVoices, OpenAIModels } from '@/types/enums';

// Define the type for patient details
export type PatientDetails = {
  about: string;
  age: string;
  sex: string;
  dateOfBirth: string;
  location: string;
  education: string;
  work: string;
  fallRisk: 'yes' | 'no';
  promptAnswers: Record<string, string>;
  likes: string;
  dislikes: string;
  symptoms: string;
  avatar: string;
};

// Default patient details
const defaultPatientDetails: PatientDetails = {
  about: '',
  age: '',
  sex: '',
  dateOfBirth: '',
  location: '',
  education: '',
  work: '',
  fallRisk: 'no',
  promptAnswers: {} as Record<string, string>,
  likes: '',
  dislikes: '',
  symptoms: '',
  avatar: ''
};

export const user = pgTable('User', {
  // Primary key
  id: uuid('id').primaryKey().notNull().defaultRandom(),

  // Authentication fields
  email: varchar('email', { length: 64 }).notNull().unique(),
  password: varchar('password', { length: 64 }),
  passcode: integer('passcode').notNull(),

  // Basic user information
  name: varchar('name', { length: 128 }).notNull().default('Unknown'),
  role: varchar('role', { enum: ['admin', 'moderator', 'user'] })
    .notNull()
    .default('user'),
  profilePicture: text('profilePicture').default(''),

  // Patient-specific information
  patientDetails: json('patientDetails')
    .$type<PatientDetails>()
    .default(defaultPatientDetails),

  // Metadata
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  isActive: boolean('isActive').notNull().default(true),

  // Optional: Add indexes for frequently queried fields
  lastLoginAt: timestamp('lastLoginAt', { mode: 'date' }),
  verifiedAt: timestamp('verifiedAt', { mode: 'date' })
});

// Helper type for type inference
export type User = InferSelectModel<typeof user>;

// Helper type for inserting new users
export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// Helper type for updating users
export type UpdateUser = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;
export const patient = pgTable('Patient', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  about: text('about').default(''),
  age: varchar('age', { length: 3 }).default(''),
  name: varchar('name', { length: 128 }).notNull().default('Unknown'),
  sex: varchar('sex', { length: 10 }).default(''),
  email: varchar('email', { length: 64 }).notNull().unique(),
  password: varchar('password', { length: 64 }),
  dateOfBirth: varchar('dateOfBirth', { length: 10 }).default(''),
  location: varchar('location', { length: 128 }).default(''),
  education: varchar('education', { length: 128 }).default(''),
  work: varchar('work', { length: 128 }).default(''),
  profilePicture: text('profilePicture').default(''),
  fallRisk: varchar('fallRisk', { enum: ['yes', 'no'] }).default('no'),
  promptAnswers: json('promptAnswers').$type<Record<string, string>>().default({}),
  likes: text('likes').default(''),
  dislikes: text('dislikes').default(''),
  symptoms: text('symptoms').default(''),
  avatar: text('avatar').default(''),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow()
});
export type Patient = InferSelectModel<typeof patient>;
export const avatar = pgTable('Avatar', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 64 }).notNull(),
  role: varchar('role', { length: 64 }).notNull(),
  about: text('about').notNull().default(''),
  age: integer('age').notNull().default(0),
  sex: varchar('sex', { length: 16 }).notNull().default(''),
  education: text('education').notNull().default(''),
  work: text('work').notNull().default(''),
  promptAnswers: jsonb('prompt_answers').notNull().default([]),
  personality: jsonb('personality').notNull().default({
    memoryEngagement: 50,
    anxietyManagement: 50,
    activityEngagement: 50,
    socialConnection: 50
  }),
  isActive: boolean('isActive').notNull().default(false),
  openaiVoice: varchar('openai_voice', {
    enum: OpenAIVoices,
  }).notNull().default('alloy'),
  openaiModel: varchar('openai_model', {
    enum: OpenAIModels,
  }).notNull().default('gpt-4o-realtime-preview'),
  simliFaceId: uuid('simli_faceid').default(sql`null`),
  simliCharacterId: uuid('simli_character_uid').default(sql`null`),
  avatarImage: text('avatar_image').default(''),
  initialPrompt: text('initialPrompt').notNull(),
  userId: uuid('userId')
    .references(() => user.id)
    .default(sql`null`)
});


export type Avatar = InferSelectModel<typeof avatar>;



// Table for storing the predefined prompt templates
export const promptTemplate = pgTable('PromptTemplate', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  question: text('question').notNull(),
  orderNumber: integer('order_number').notNull(), // To maintain the order (1-17)
  isActive: boolean('isActive').notNull().default(true),
  type: varchar('type', {
    enum: ['patient', 'avatar'],
  }).notNull().default('avatar'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});
export type PromptTemplate = InferSelectModel<typeof promptTemplate>;




export const call = pgTable('Call', {
  // Primary key and metadata
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  endedAt: timestamp('endedAt', { mode: 'date' }),
  duration: integer('duration'), // in seconds

  // Relationships
  userId: uuid('userId').references(() => patient.id).notNull(),
  // patientId: uuid('patientId').references(() => patient.id).notNull(),
  avatarId: uuid('avatarId').references(() => avatar.id).notNull(),

  // Call details
  status: varchar('status', {
    enum: ['active', 'completed', 'failed', 'missed']
  }).notNull().default('active'),

  recordingUrl: text('recordingUrl'),
  transcriptUrl: text('transcriptUrl').default(''),
  prompt: text('prompt').default(''),
  // Call metrics
  qualityMetrics: jsonb('qualityMetrics').default({
    audioQuality: 100,
    videoQuality: 100,
    networkLatency: 0,
    dropouts: 0
  }),

  // Conversation metrics
  conversationMetrics: jsonb('conversationMetrics').default({
    userSpeakingTime: 0,
    avatarSpeakingTime: 0,
    turnsCount: 0,
    avgResponseTime: 0
  }),

  // Technical details
  technicalDetails: jsonb('technicalDetails').default({
    browserInfo: '',
    deviceType: '',
    networkType: '',
    osVersion: ''
  }),
  // Technical details
  analysis: jsonb('analysis').default({
  }),

  // Error tracking
  errorLogs: jsonb('errorLogs').$type<{
    timestamp: string;
    error: string;
    context: string;
  }[]>().default([]),

  // Optional metadata
  metadata: jsonb('metadata').default({}),
});

// Helper types
export type Call = InferSelectModel<typeof call>;
export type NewCall = Omit<Call, 'id' | 'createdAt '>;
export type UpdateCall = Partial<Omit<Call, 'id' | 'createdAt'>>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
});

export type Chat = InferSelectModel<typeof chat>;



export const message = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('text', { enum: ['text', 'code', 'image'] })
      .notNull()
      .default('text'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: boolean('isResolved').notNull().default(false),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  }),
);

export type Suggestion = InferSelectModel<typeof suggestion>;
