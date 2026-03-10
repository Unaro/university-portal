// src/shared/types/db.ts
import { type InferSelectModel } from "drizzle-orm";
import * as schema from "@/db/schema";

// 1. Базовые сущности (прямо из таблиц)
export type User = InferSelectModel<typeof schema.users>;
export type Student = InferSelectModel<typeof schema.students>;
export type Organization = InferSelectModel<typeof schema.organizations>;
export type Vacancy = InferSelectModel<typeof schema.vacancies>;
export type Application = InferSelectModel<typeof schema.applications>;
export type Major = InferSelectModel<typeof schema.majors>;
export type Skill = InferSelectModel<typeof schema.skills>;
export type Material = InferSelectModel<typeof schema.materials>;
export type Resume = InferSelectModel<typeof schema.resumes>;

// 2. Сложные типы (с Join-ами)
// Drizzle возвращает вложенные объекты при использовании db.query...with

export type StudentWithSkills = Student & {
  skills: {
    skill: Skill;
  }[];
};

export type ApplicationWithDetails = Application & {
  vacancy: Vacancy & {
    organization: Organization;
  };
};

export type ApplicationStatus = "pending" | "approved" | "rejected";