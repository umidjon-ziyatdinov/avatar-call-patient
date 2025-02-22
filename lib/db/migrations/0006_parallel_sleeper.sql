ALTER TABLE "User" ADD COLUMN "name" varchar(128) DEFAULT 'Unknown' NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "role" varchar DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "profilePicture" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "isActive" boolean DEFAULT true NOT NULL;