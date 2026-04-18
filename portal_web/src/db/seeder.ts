/**
 * Seeder script for University Portal
 * - Clears database and MinIO
 * - Seeds fresh data
 */

import { db } from "./index";
import {
  majors,
  skills,
  users,
  organizations,
  students,
  studentSkills,
  universityStaff,
  organizationRepresentatives,
  vacancies,
  vacancyAllowedMajors,
  vacancySkills,
  applications,
  resumes,
  materials,
} from "./schema";
import { hash } from "bcryptjs";
import {
  MAJORS,
  SKILLS,
  USERS,
  ORGANIZATIONS,
  STUDENTS,
  STUDENT_SKILLS,
  RESUMES,
  VACANCIES,
  VACANCY_MAJORS,
  VACANCY_SKILLS,
  APPLICATIONS,
  UNIVERSITY_STAFF,
  ORGANIZATION_REPRESENTATIVES,
  MATERIALS,
  MINIO_FILES,
} from "./seed-data";
import { S3Client, CreateBucketCommand, PutObjectCommand, DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";


if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_SEED_IN_PROD) {
  console.error("seeding is disabled in production. Set ALLOW_SEED_IN_PROD=1 to override.");
  process.exit(1);
}

// ==================== MINIO CLIENT ====================

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "portal-documents";
const REGION = process.env.S3_REGION || "us-east-1";
const ENDPOINT = process.env.S3_ENDPOINT || "http://minio:9000";
const ACCESS_KEY = process.env.S3_ACCESS_KEY || process.env.MINIO_ROOT_USER || "portal_admin";
const SECRET_KEY = process.env.S3_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD || "";

const s3Client = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
  forcePathStyle: true,
});

// ==================== DATABASE CLEAR ====================

async function clearDatabase() {
  console.log("🧹 Clearing database...");
  
  // Order matters due to foreign key constraints
  // Delete from tables with FKs first, then base tables
  
  await db.delete(applications).execute();
  console.log("  ✓ Cleared applications");
  
  await db.delete(vacancySkills).execute();
  console.log("  ✓ Cleared vacancy_skills");
  
  await db.delete(vacancyAllowedMajors).execute();
  console.log("  ✓ Cleared vacancy_allowed_majors");
  
  await db.delete(studentSkills).execute();
  console.log("  ✓ Cleared student_skills");
  
  await db.delete(resumes).execute();
  console.log("  ✓ Cleared resumes");
  
  await db.delete(materials).execute();
  console.log("  ✓ Cleared materials");
  
  await db.delete(vacancies).execute();
  console.log("  ✓ Cleared vacancies");
  
  await db.delete(organizationRepresentatives).execute();
  console.log("  ✓ Cleared organization_representatives");
  
  await db.delete(universityStaff).execute();
  console.log("  ✓ Cleared university_staff");
  
  await db.delete(students).execute();
  console.log("  ✓ Cleared students");
  
  await db.delete(organizations).execute();
  console.log("  ✓ Cleared organizations");
  
  await db.delete(users).execute();
  console.log("  ✓ Cleared users");
  
  await db.delete(skills).execute();
  console.log("  ✓ Cleared skills");
  
  await db.delete(majors).execute();
  console.log("  ✓ Cleared majors");
  
  console.log("✅ Database cleared successfully\n");
}

// ==================== MINIO OPERATIONS ====================

async function clearMinIO() {
  console.log("🧹 Clearing MinIO bucket...");
  
  try {
    // List all objects in bucket
    const listResponse = await s3Client.send(
      new ListObjectsV2Command({ Bucket: BUCKET_NAME })
    );
    
    if (listResponse.Contents && listResponse.Contents.length > 0) {
      // Delete all objects
      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: BUCKET_NAME,
          Delete: {
            Objects: listResponse.Contents.map(obj => ({ Key: obj.Key! })),
          },
        })
      );
      console.log(`  ✓ Deleted ${listResponse.Contents.length} objects`);
    } else {
      console.log("  ℹ️ Bucket is empty");
    }
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string };
    if (err.name === "NoSuchBucket") {
      console.log("  ℹ️ Bucket does not exist yet");
    } else {
      console.error("  ⚠ Error clearing bucket:", err.message);
    }
  }
  
  console.log("✅ MinIO cleared successfully\n");
}

async function seedMinIO() {
  console.log("📦 Seeding MinIO...");
  
  // Create bucket if not exists
  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
    console.log(`  ✓ Created bucket '${BUCKET_NAME}'`);
  } catch (error: unknown) {
    const err = error as { name?: string };
    if (err.name === "BucketAlreadyOwnedByYou" || err.name === "BucketAlreadyExists") {
      console.log(`  ℹ️ Bucket '${BUCKET_NAME}' already exists`);
    } else {
      throw error;
    }
  }
  
  // Upload files
  let successCount = 0;
  for (const file of MINIO_FILES) {
    try {
      const buffer = Buffer.from(file.content, "utf-8");
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: file.path,
          Body: buffer,
          ContentType: getContentType(file.path),
        })
      );
      console.log(`  ✓ ${file.path}`);
      successCount++;
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error(`  ✗ ${file.path}: ${err.message}`);
    }
  }
  
  console.log(`✅ MinIO seeded: ${successCount}/${MINIO_FILES.length} files\n`);
}

function getContentType(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase();
  const contentTypes: Record<string, string> = {
    "pdf": "application/pdf",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "png": "image/png",
    "jpg": "image/jpeg",
    "svg": "image/svg+xml",
    "txt": "text/plain",
  };
  return contentTypes[ext || ""] || "application/octet-stream";
}

// ==================== DATABASE SEED ====================

async function seedDatabase() {
  console.log("🌱 Seeding database...");
  
  // 1. Majors
  const insertedMajors = await db.insert(majors).values(MAJORS).onConflictDoNothing().returning();
  console.log(`  ✓ ${insertedMajors.length} majors`);
  
  // 2. Skills
  const insertedSkills = await db.insert(skills).values(SKILLS).onConflictDoNothing().returning();
  console.log(`  ✓ ${insertedSkills.length} skills`);
  
  // 3. Users
  const hashedPassword = await hash("password123", 10);
  const insertedUsers = await db
    .insert(users)
    .values(USERS.map(u => ({ ...u, password: hashedPassword, emailVerified: new Date() })))
    .onConflictDoNothing()
    .returning();
  console.log(`  ✓ ${insertedUsers.length} users`);
  
  // 4. Organizations
  const insertedOrganizations = await db.insert(organizations).values(ORGANIZATIONS).onConflictDoNothing().returning();
  console.log(`  ✓ ${insertedOrganizations.length} organizations`);
  
  // 5. Students
  const insertedStudents = await db
    .insert(students)
    .values(STUDENTS.map(s => ({
      userId: insertedUsers[s.userIndex].id!,
      group: s.group,
      course: s.course,
      majorId: insertedMajors[s.majorIndex]?.id,
      currentPracticeType: s.currentPracticeType,
      projectTheme: s.projectTheme,
    })))
    .onConflictDoNothing()
    .returning();
  console.log(`  ✓ ${insertedStudents.length} students`);
  
  // 6. University Staff
  await db.insert(universityStaff).values(
    UNIVERSITY_STAFF.map(s => ({
      userId: insertedUsers[s.userIndex].id!,
      department: s.department,
      position: s.position,
    }))
  ).onConflictDoNothing();
  console.log(`  ✓ ${UNIVERSITY_STAFF.length} university staff`);
  
  // 7. Organization Representatives
  await db.insert(organizationRepresentatives).values(
    ORGANIZATION_REPRESENTATIVES.map(r => ({
      userId: insertedUsers[r.userIndex].id!,
      organizationId: insertedOrganizations[r.organizationIndex].id!,
      position: r.position,
    }))
  ).onConflictDoNothing();
  console.log(`  ✓ ${ORGANIZATION_REPRESENTATIVES.length} organization representatives`);
  
  // 8. Student Skills
  await db.insert(studentSkills).values(
    STUDENT_SKILLS.map(ss => ({
      studentId: insertedStudents[ss.studentIndex]!.id!,
      skillId: insertedSkills[ss.skillIndex]?.id,
    }))
  ).onConflictDoNothing();
  console.log(`  ✓ ${STUDENT_SKILLS.length} student skills`);
  
  // 9. Resumes
  await db.insert(resumes).values(
    RESUMES.map(r => ({
      studentId: insertedStudents[r.studentIndex]!.id!,
      bio: r.bio,
      fileUrl: r.fileUrl,
    }))
  ).onConflictDoNothing();
  console.log(`  ✓ ${RESUMES.length} resumes`);
  
  // 10. Vacancies
  const insertedVacancies = await db
    .insert(vacancies)
    .values(VACANCIES.map(v => ({
      title: v.title,
      description: v.description,
      requirements: v.requirements,
      organizationId: insertedOrganizations[v.organizationIndex].id!,
      isActive: v.isActive,
      type: v.type,
      salary: v.salary,
      minCourse: v.minCourse,
      availableSpots: (v as any).availableSpots || null,
      startDate: v.startDate || null,
      endDate: v.endDate || null,
      })))
    .onConflictDoNothing()
    .returning();
  console.log(`  ✓ ${insertedVacancies.length} vacancies`);
  
  // 11. Vacancy Majors
  await db.insert(vacancyAllowedMajors).values(
    VACANCY_MAJORS.map(vm => ({
      vacancyId: insertedVacancies[vm.vacancyIndex]!.id!,
      majorId: insertedMajors[vm.majorIndex].id!,
    }))
  ).onConflictDoNothing();
  console.log(`  ✓ ${VACANCY_MAJORS.length} vacancy-major relations`);
  
  // 12. Vacancy Skills
  await db.insert(vacancySkills).values(
    VACANCY_SKILLS.map(vs => ({
      vacancyId: insertedVacancies[vs.vacancyIndex]!.id!,
      skillId: insertedSkills[vs.skillIndex]?.id,
    }))
  ).onConflictDoNothing();
  console.log(`  ✓ ${VACANCY_SKILLS.length} vacancy-skill relations`);
  
  // 13. Applications
  await db.insert(applications).values(
    APPLICATIONS.map(a => {
      const vacancy = insertedVacancies[a.vacancyIndex]!;
      const student = STUDENTS[a.studentIndex]!;
      return {
        studentId: insertedStudents[a.studentIndex]!.id!,
        vacancyId: vacancy.id!,
        status: a.status as "pending" | "approved" | "rejected",
        universityApprovalStatus: (vacancy.type === "practice" ? (a.status === "pending" ? "pending" : "approved") : "not_required") as "pending" | "approved" | "not_required" | "rejected",
        practiceType: (vacancy.type === "practice" ? (a.practiceType || student.currentPracticeType) : null) as "educational" | "production" | "pre_diploma" | null,
        projectTheme: (vacancy.type === "practice" ? (a.projectTheme || student.projectTheme) : null) as string | null,
        coverLetter: a.coverLetter,
        responseMessage: a.responseMessage,
      };
    })
  ).onConflictDoNothing();
  console.log(`  ✓ ${APPLICATIONS.length} applications`);
  
  // 14. Materials
  await db.insert(materials).values(MATERIALS).onConflictDoNothing();
  console.log(`  ✓ ${MATERIALS.length} materials`);
  
  console.log("\n✅ Database seeded successfully!\n");
}

// ==================== MAIN ====================

async function main() {
  console.log("\n" + "=".repeat(50));
  console.log("🎓 UNIVERSITY PORTAL - FULL SEEDER");
  console.log("=".repeat(50) + "\n");
  
  const clearDb = process.env.CLEAR_DB !== "false"; // Default: true
  const clearMinio = process.env.CLEAR_MINIO !== "false"; // Default: true
  
  try {
    // Clear if requested
    if (clearDb) {
      await clearDatabase();
    }
    
    if (clearMinio) {
      await clearMinIO();
    }
    
    // Seed
    await seedMinIO();
    await seedDatabase();
    
    console.log("=".repeat(50));
    console.log("✅ ALL DONE! Portal is ready to use.");
    console.log("=".repeat(50) + "\n");
    
    console.log("📝 Login credentials:");
    console.log("   Admin: admin@university.edu / password123");
    console.log("   Student: akhmetov@student.edu / password123");
    console.log("   Org Rep: kozlov@yandex.kz / password123");
    console.log("");
    
  } catch (error) {
    console.error("\n❌ Seeder failed:", error);
    process.exit(1);
  }
}

main();
