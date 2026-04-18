CREATE TYPE "public"."university_approval_status" AS ENUM('not_required', 'pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "application" ADD COLUMN "university_approval_status" "university_approval_status" DEFAULT 'not_required' NOT NULL;--> statement-breakpoint
ALTER TABLE "application" ADD COLUMN "university_staff_id" integer;--> statement-breakpoint
ALTER TABLE "application" ADD COLUMN "university_comment" text;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_university_staff_id_university_staff_id_fk" FOREIGN KEY ("university_staff_id") REFERENCES "public"."university_staff"("id") ON DELETE set null ON UPDATE no action;