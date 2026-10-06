"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { assertAdmin } from "@/lib/admin-auth";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/upload";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}

/* =========================================================================
   PROJECTS CRUD
   ========================================================================= */

export async function createProjectAction(formData: FormData): Promise<ActionResult> {
  await assertAdmin();

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const techStack = (formData.get("tech_stack") as string)?.trim() || null;
  const githubUrl = (formData.get("github_url") as string)?.trim() || null;
  const demoUrl = (formData.get("demo_url") as string)?.trim() || null;
  const imageFile = formData.get("image") as File | null;

  if (!title) {
    return { success: false, message: "Project title is required" };
  }

  let imagePath: string | null = null;
  if (imageFile && imageFile.size > 0) {
    try {
      imagePath = await saveUploadedFile(imageFile, { category: "projects" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Image upload failed";
      return { success: false, message: msg };
    }
  }

  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        techStack,
        githubUrl,
        demoUrl,
        image: imagePath,
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");

    return { success: true, message: "Project created successfully", data: project };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create project";
    return { success: false, message: msg };
  }
}

export async function updateProjectAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin();

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const techStack = (formData.get("tech_stack") as string)?.trim() || null;
  const githubUrl = (formData.get("github_url") as string)?.trim() || null;
  const demoUrl = (formData.get("demo_url") as string)?.trim() || null;
  const imageFile = formData.get("image") as File | null;
  const removeImage = formData.get("remove_image") === "true";

  if (!title) {
    return { success: false, message: "Project title is required" };
  }

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Project not found" };
  }

  let imagePath = existing.image;

  if (removeImage) {
    if (existing.image) {
      deleteUploadedFile(existing.image);
    }
    imagePath = null;
  }

  if (imageFile && imageFile.size > 0) {
    try {
      const newPath = await saveUploadedFile(imageFile, { category: "projects" });
      if (existing.image) {
        deleteUploadedFile(existing.image);
      }
      imagePath = newPath;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Image upload failed";
      return { success: false, message: msg };
    }
  }

  try {
    const updated = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        techStack,
        githubUrl,
        demoUrl,
        image: imagePath,
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}/edit`);
    revalidatePath("/projects");
    revalidatePath("/");

    return { success: true, message: "Project updated successfully", data: updated };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update project";
    return { success: false, message: msg };
  }
}

export async function deleteProjectAction(id: number): Promise<ActionResult> {
  await assertAdmin();

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Project not found" };
  }

  if (existing.image) {
    deleteUploadedFile(existing.image);
  }

  await prisma.project.delete({ where: { id } });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");

  return { success: true, message: "Project deleted successfully" };
}

/* =========================================================================
   SKILLS CRUD
   ========================================================================= */

export async function createSkillAction(formData: FormData): Promise<ActionResult> {
  await assertAdmin();

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const category = (formData.get("category") as string)?.trim() || null;

  if (!name) {
    return { success: false, message: "Skill title/name is required" };
  }

  try {
    const skill = await prisma.skill.create({
      data: {
        name,
        description,
        category,
      },
    });

    revalidatePath("/admin/skills");
    revalidatePath("/skills");
    revalidatePath("/about");
    revalidatePath("/");

    return { success: true, message: "Skill created successfully", data: skill };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create skill";
    return { success: false, message: msg };
  }
}

export async function updateSkillAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin();

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const category = (formData.get("category") as string)?.trim() || null;

  if (!name) {
    return { success: false, message: "Skill title/name is required" };
  }

  try {
    const updated = await prisma.skill.update({
      where: { id },
      data: {
        name,
        description,
        category,
      },
    });

    revalidatePath("/admin/skills");
    revalidatePath(`/admin/skills/${id}/edit`);
    revalidatePath("/skills");
    revalidatePath("/about");
    revalidatePath("/");

    return { success: true, message: "Skill updated successfully", data: updated };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update skill";
    return { success: false, message: msg };
  }
}

export async function deleteSkillAction(id: number): Promise<ActionResult> {
  await assertAdmin();

  await prisma.skill.delete({ where: { id } });

  revalidatePath("/admin/skills");
  revalidatePath("/skills");
  revalidatePath("/about");
  revalidatePath("/");

  return { success: true, message: "Skill deleted successfully" };
}

/* =========================================================================
   ACADEMICS CRUD
   ========================================================================= */

export async function createAcademicAction(formData: FormData): Promise<ActionResult> {
  await assertAdmin();

  const degree = (formData.get("degree") as string)?.trim();
  const institution = (formData.get("institution") as string)?.trim();
  const year = (formData.get("year") as string)?.trim();
  const result = (formData.get("result") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;

  if (!degree || !institution || !year) {
    return { success: false, message: "Degree, Institution, and Year are required" };
  }

  try {
    const academic = await prisma.academic.create({
      data: {
        degree,
        institution,
        year,
        result,
        description,
      },
    });

    revalidatePath("/admin/academics");
    revalidatePath("/academic");
    revalidatePath("/about");

    return { success: true, message: "Academic record created successfully", data: academic };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create academic record";
    return { success: false, message: msg };
  }
}

export async function updateAcademicAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin();

  const degree = (formData.get("degree") as string)?.trim();
  const institution = (formData.get("institution") as string)?.trim();
  const year = (formData.get("year") as string)?.trim();
  const result = (formData.get("result") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;

  if (!degree || !institution || !year) {
    return { success: false, message: "Degree, Institution, and Year are required" };
  }

  try {
    const updated = await prisma.academic.update({
      where: { id },
      data: {
        degree,
        institution,
        year,
        result,
        description,
      },
    });

    revalidatePath("/admin/academics");
    revalidatePath(`/admin/academics/${id}/edit`);
    revalidatePath("/academic");
    revalidatePath("/about");

    return { success: true, message: "Academic record updated successfully", data: updated };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update academic record";
    return { success: false, message: msg };
  }
}

export async function deleteAcademicAction(id: number): Promise<ActionResult> {
  await assertAdmin();

  await prisma.academic.delete({ where: { id } });

  revalidatePath("/admin/academics");
  revalidatePath("/academic");
  revalidatePath("/about");

  return { success: true, message: "Academic record deleted successfully" };
}

/* =========================================================================
   ACHIEVEMENTS CRUD
   ========================================================================= */

export async function createAchievementAction(formData: FormData): Promise<ActionResult> {
  await assertAdmin();

  const title = (formData.get("title") as string)?.trim();
  const issuer = (formData.get("issuer") as string)?.trim() || null;
  const dateStr = (formData.get("date") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const certificateUrl = (formData.get("certificate_url") as string)?.trim() || null;

  if (!title) {
    return { success: false, message: "Achievement title is required" };
  }

  const parsedDate = dateStr ? new Date(dateStr) : null;

  try {
    const achievement = await prisma.achievement.create({
      data: {
        title,
        issuer,
        date: parsedDate,
        description,
        certificateUrl,
      },
    });

    revalidatePath("/admin/achievements");
    revalidatePath("/achievements");

    return { success: true, message: "Achievement created successfully", data: achievement };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create achievement";
    return { success: false, message: msg };
  }
}

export async function updateAchievementAction(
  id: number,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin();

  const title = (formData.get("title") as string)?.trim();
  const issuer = (formData.get("issuer") as string)?.trim() || null;
  const dateStr = (formData.get("date") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const certificateUrl = (formData.get("certificate_url") as string)?.trim() || null;

  if (!title) {
    return { success: false, message: "Achievement title is required" };
  }

  const parsedDate = dateStr ? new Date(dateStr) : null;

  try {
    const updated = await prisma.achievement.update({
      where: { id },
      data: {
        title,
        issuer,
        date: parsedDate,
        description,
        certificateUrl,
      },
    });

    revalidatePath("/admin/achievements");
    revalidatePath(`/admin/achievements/${id}/edit`);
    revalidatePath("/achievements");

    return { success: true, message: "Achievement updated successfully", data: updated };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update achievement";
    return { success: false, message: msg };
  }
}

export async function deleteAchievementAction(id: number): Promise<ActionResult> {
  await assertAdmin();

  await prisma.achievement.delete({ where: { id } });

  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");

  return { success: true, message: "Achievement deleted successfully" };
}

/* =========================================================================
   SETTINGS MANAGEMENT
   ========================================================================= */

export async function updateSettingsAction(formData: FormData): Promise<ActionResult> {
  await assertAdmin();

  try {
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("$ACTION_") || key === "cv_file_upload") continue;

      if (typeof value === "string") {
        await prisma.setting.upsert({
          where: { key },
          create: { key, value: value.trim() },
          update: { value: value.trim() },
        });
      }
    }

    // Handle CV file upload if present
    const cvFile = formData.get("cv_file_upload") as File | null;
    if (cvFile && cvFile.size > 0) {
      const cvPath = await saveUploadedFile(cvFile, {
        category: "settings",
        allowPdf: true,
      });

      await prisma.setting.upsert({
        where: { key: "cv_file" },
        create: { key: "cv_file", value: cvPath },
        update: { value: cvPath },
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");

    return { success: true, message: "Settings saved successfully" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update settings";
    return { success: false, message: msg };
  }
}

export async function saveSingleSettingAction(
  key: string,
  value: string
): Promise<ActionResult> {
  await assertAdmin();

  if (!key.trim()) {
    return { success: false, message: "Setting key is required" };
  }

  try {
    await prisma.setting.upsert({
      where: { key: key.trim() },
      create: { key: key.trim(), value: value.trim() },
      update: { value: value.trim() },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");

    return { success: true, message: `Setting "${key}" updated` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save setting";
    return { success: false, message: msg };
  }
}

export async function deleteSettingAction(id: number): Promise<ActionResult> {
  await assertAdmin();

  await prisma.setting.delete({ where: { id } });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/about");

  return { success: true, message: "Setting deleted successfully" };
}

/* =========================================================================
   MESSAGES MANAGEMENT
   ========================================================================= */

export async function deleteMessageAction(id: number): Promise<ActionResult> {
  await assertAdmin();

  await prisma.message.delete({ where: { id } });

  revalidatePath("/admin/messages");
  revalidatePath("/admin");

  return { success: true, message: "Message deleted successfully" };
}
