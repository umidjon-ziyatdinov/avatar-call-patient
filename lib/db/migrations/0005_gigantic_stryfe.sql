CREATE TABLE IF NOT EXISTS "Avatar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"role" varchar(64) NOT NULL,
	"avatar" text NOT NULL,
	"openai_voice" varchar NOT NULL,
	"openai_model" varchar NOT NULL,
	"simli_faceid" uuid NOT NULL,
	"initialPrompt" text NOT NULL
);
