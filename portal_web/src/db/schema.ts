// src/db/schema.ts
import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- 1. ENUMS ---
export const roleEnum = pgEnum("role", [
  "student",
  "university_staff",
  "organization_representative",
  "admin",
]);

export const moderationStatusEnum = pgEnum("moderation_status", [
  "pending",
  "approved",
  "rejected",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "approved",
  "rejected",
]);

export const internshipTypeEnum = pgEnum("internship_type", [
  "practice",
  "internship",
  "job",
]);

export const universityApprovalStatusEnum = pgEnum("university_approval_status", [
  "not_required",
  "pending",
  "approved",
  "rejected",
]);

export const studentPracticeTypeEnum = pgEnum("student_practice_type", [
  "educational", // Учебная
  "production",  // Производственная
  "pre_diploma", // Преддипломная
]);

// --- 2. TABLES (Определяем ВСЕ таблицы сначала) ---

// Справочники
export const majors = pgTable("major", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  code: text("code"),
});

export const skills = pgTable("skill", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// Пользователи
export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: roleEnum("role").default("student").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Организации
export const organizations = pgTable("organization", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  iin: text("iin").notNull().unique(),
  contacts: text("contacts"),
  description: text("description"),
  website: text("website"),
  verificationStatus: moderationStatusEnum("verification_status")
    .default("pending")
    .notNull(),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Вакансии
export const vacancies = pgTable("vacancy", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  organizationId: integer("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  isActive: boolean("is_active").default(true),
  type: internshipTypeEnum("type").default("practice").notNull(),
  salary: text("salary"),
  minCourse: integer("min_course").default(1),
  availableSpots: integer("available_spots"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Связи Вакансий (Join Tables)
export const vacancyAllowedMajors = pgTable("vacancy_allowed_major", {
  vacancyId: integer("vacancy_id").notNull().references(() => vacancies.id, { onDelete: "cascade" }),
  majorId: integer("major_id").notNull().references(() => majors.id, { onDelete: "cascade" }),
}, (t) => ({
  pk: primaryKey({ columns: [t.vacancyId, t.majorId] }),
}));

export const vacancySkills = pgTable("vacancy_skill", {
  vacancyId: integer("vacancy_id").notNull().references(() => vacancies.id, { onDelete: "cascade" }),
  skillId: integer("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
}, (t) => ({
  pk: primaryKey({ columns: [t.vacancyId, t.skillId] }),
}));

// Профили
export const students = pgTable("student", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  group: text("group"),
  course: integer("course").default(1),
  majorId: integer("major_id").references(() => majors.id),
  currentPracticeType: studentPracticeTypeEnum("current_practice_type").default("educational"),
  projectTheme: text("project_theme"),
});

export const studentSkills = pgTable("student_skill", {
  studentId: integer("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  skillId: integer("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
}, (t) => ({
  pk: primaryKey({ columns: [t.studentId, t.skillId] }),
}));

export const universityStaff = pgTable("university_staff", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  department: text("department"),
  position: text("position"),
});

export const organizationRepresentatives = pgTable(
  "organization_representative",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    position: text("position"),
  }
);

// Заявки и Резюме
export const applications = pgTable("application", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  vacancyId: integer("vacancy_id")
    .notNull()
    .references(() => vacancies.id, { onDelete: "cascade" }),
  status: applicationStatusEnum("status").default("pending").notNull(),
  universityApprovalStatus: universityApprovalStatusEnum("university_approval_status")
    .default("not_required")
    .notNull(),
  universityStaffId: integer("university_staff_id")
    .references(() => universityStaff.id, { onDelete: "set null" }),
  universityComment: text("university_comment"),
  practiceType: studentPracticeTypeEnum("practice_type"),
  projectTheme: text("project_theme"),
  coverLetter: text("cover_letter"),
  responseMessage: text("response_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resumes = pgTable("resume", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" })
    .unique(),
  bio: text("bio"),
  fileUrl: text("file_url"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- MODULE: MATERIALS ---

export const materialCategoryEnum = pgEnum("material_category", [
  "regulatory", // Нормативные акты
  "template",   // Шаблоны
  "material",   // Полезные материалы (презентации и т.д.)
]);

export const materials = pgTable("material", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // Например "Шаблон дневника практики"
  description: text("description"), 
  fileUrl: text("file_url").notNull(), // Ссылка на S3
  category: materialCategoryEnum("category").default("material").notNull(),
  isPublic: boolean("is_public").default(true), // Видно ли гостям
  createdAt: timestamp("created_at").defaultNow(),
});

// --- 3. RELATIONS (Только теперь, когда все таблицы объявлены) ---

export const usersRelations = relations(users, ({ one }) => ({
  studentProfile: one(students, { fields: [users.id], references: [students.userId] }),
  orgRepresentativeProfile: one(organizationRepresentatives, { fields: [users.id], references: [organizationRepresentatives.userId] }),
  staffProfile: one(universityStaff, { fields: [users.id], references: [universityStaff.userId] }),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  representatives: many(organizationRepresentatives),
  vacancies: many(vacancies),
}));

export const vacanciesRelations = relations(vacancies, ({ one, many }) => ({
  organization: one(organizations, { fields: [vacancies.organizationId], references: [organizations.id] }),
  applications: many(applications),
  allowedMajors: many(vacancyAllowedMajors),
  requiredSkills: many(vacancySkills),
}));

export const vacancyAllowedMajorsRelations = relations(vacancyAllowedMajors, ({ one }) => ({
  vacancy: one(vacancies, { fields: [vacancyAllowedMajors.vacancyId], references: [vacancies.id] }),
  major: one(majors, { fields: [vacancyAllowedMajors.majorId], references: [majors.id] }),
}));

export const vacancySkillsRelations = relations(vacancySkills, ({ one }) => ({
  vacancy: one(vacancies, { fields: [vacancySkills.vacancyId], references: [vacancies.id] }),
  skill: one(skills, { fields: [vacancySkills.skillId], references: [skills.id] }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, { fields: [students.userId], references: [users.id] }),
  major: one(majors, { fields: [students.majorId], references: [majors.id] }),
  applications: many(applications),
  resume: one(resumes, { fields: [students.id], references: [resumes.studentId] }),
  skills: many(studentSkills),
}));

export const studentSkillsRelations = relations(studentSkills, ({ one }) => ({
  student: one(students, { fields: [studentSkills.studentId], references: [students.id] }),
  skill: one(skills, { fields: [studentSkills.skillId], references: [skills.id] }),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  student: one(students, { fields: [applications.studentId], references: [students.id] }),
  vacancy: one(vacancies, { fields: [applications.vacancyId], references: [vacancies.id] }),
  approvedByStaff: one(universityStaff, { fields: [applications.universityStaffId], references: [universityStaff.id] }),
}));

export const resumesRelations = relations(resumes, ({ one }) => ({
  student: one(students, { fields: [resumes.studentId], references: [students.id] }),
}));

export const orgRepresentativesRelations = relations(organizationRepresentatives, ({ one }) => ({
  user: one(users, { fields: [organizationRepresentatives.userId], references: [users.id] }),
  organization: one(organizations, { fields: [organizationRepresentatives.organizationId], references: [organizations.id] }),
}));