CREATE TYPE "public"."student_practice_type" AS ENUM('educational', 'production', 'pre_diploma');--> statement-breakpoint
ALTER TABLE "application" ADD COLUMN "practice_type" "student_practice_type";--> statement-breakpoint
ALTER TABLE "application" ADD COLUMN "project_theme" text;--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN "current_practice_type" "student_practice_type" DEFAULT 'educational';--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN "project_theme" text;