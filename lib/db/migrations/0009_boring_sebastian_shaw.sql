ALTER TABLE "Avatar" ALTER COLUMN "openai_voice" SET DEFAULT 'alloy';--> statement-breakpoint
ALTER TABLE "Avatar" ALTER COLUMN "openai_model" SET DEFAULT 'gpt-4o-realtime-preview';--> statement-breakpoint
ALTER TABLE "Avatar" ALTER COLUMN "simli_faceid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Avatar" ADD COLUMN "about" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "Avatar" ADD COLUMN "age" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "Avatar" ADD COLUMN "sex" varchar(16) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "Avatar" ADD COLUMN "education" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "Avatar" ADD COLUMN "work" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "Avatar" ADD COLUMN "prompt1" varchar DEFAULT 'family' NOT NULL;--> statement-breakpoint
ALTER TABLE "Avatar" ADD COLUMN "prompt2" varchar DEFAULT 'daily' NOT NULL;--> statement-breakpoint
ALTER TABLE "Avatar" ADD COLUMN "prompt3" varchar DEFAULT 'memories' NOT NULL;--> statement-breakpoint
ALTER TABLE "Avatar" ADD COLUMN "personality" jsonb DEFAULT '{"memoryEngagement":50,"anxietyManagement":50,"activityEngagement":50,"socialConnection":50}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "Avatar" ADD COLUMN "isActive" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "Avatar" ADD COLUMN "simli_character_uid" uuid;--> statement-breakpoint
ALTER TABLE "Avatar" ADD COLUMN "avatar_image" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "Avatar" DROP COLUMN IF EXISTS "avatar";