ALTER TABLE "User" ALTER COLUMN "profilePicture" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "patientDetails" json DEFAULT '{"about":"","age":"","sex":"","dateOfBirth":"","location":"","education":"","work":"","fallRisk":"no","prompt1":"","prompt2":"","prompt3":"","likes":"","dislikes":"","symptoms":"","avatar":""}'::json;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "lastLoginAt" timestamp;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "verifiedAt" timestamp;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_email_unique" UNIQUE("email");