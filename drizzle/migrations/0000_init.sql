CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "game_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"category_id" integer
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"quiz_id" integer,
	"text" varchar(300) NOT NULL,
	"options" jsonb NOT NULL,
	"correct" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"date" date,
	"game_type_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "game_types" ADD CONSTRAINT "game_types_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_game_type_id_game_types_id_fk" FOREIGN KEY ("game_type_id") REFERENCES "public"."game_types"("id") ON DELETE no action ON UPDATE no action;