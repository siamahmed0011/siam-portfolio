import "dotenv/config";
import fs from "fs";
import path from "path";
import prisma from "../src/lib/prisma";

const DATA_JSON_PATH = "E:/FullStack_dynamic_portfolio/database/seeders/data.json";

interface LegacyProject {
  id?: number;
  title: string;
  description?: string | null;
  image?: string | null;
  tech_stack?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface LegacySkill {
  id?: number;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface LegacyAcademic {
  id?: number;
  degree: string;
  institution: string;
  year: string;
  result?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface LegacyAchievement {
  id?: number;
  title: string;
  issuer?: string | null;
  date?: string | null;
  description?: string | null;
  certificate_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface LegacySetting {
  id?: number;
  key: string;
  value?: string | null;
  created_at?: string;
  updated_at?: string;
}

async function importLegacyData() {
  console.log("=== Starting Legacy Data Migration (Read-Only Source) ===");

  if (!fs.existsSync(DATA_JSON_PATH)) {
    throw new Error(`Legacy data file not found at: ${DATA_JSON_PATH}`);
  }

  const fileContent = fs.readFileSync(DATA_JSON_PATH, "utf-8");
  const data = JSON.parse(fileContent);

  // 1. Migrate Settings
  if (Array.isArray(data.settings)) {
    console.log(`Migrating ${data.settings.length} settings...`);
    for (const item of data.settings as LegacySetting[]) {
      if (!item.key) continue;
      await prisma.setting.upsert({
        where: { key: item.key },
        create: {
          key: item.key,
          value: item.value ?? null,
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
          updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
        },
        update: {
          value: item.value ?? null,
          updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
        },
      });
    }
  }

  // Fallback / Standard canonical settings if not present
  const standardDefaults: Record<string, string> = {
    site_name: "Shiam Ahmed",
    hero_title: "Shiam Ahmed",
    hero_description:
      "Flutter Developer & Digital Marketer skilled in building cross-platform mobile apps, Canva graphic design, and modern web development",
    about_intro:
      "Flutter Developer with hands-on experience building cross-platform mobile apps using Flutter and Firebase. Skilled in UI design, real-time databases, role-based systems, HTML, CSS, and JavaScript. Also proficient in Canva graphic design, AI video creation, and digital marketing. Seeking an entry-level Flutter Developer or Digital Marketing role to deliver impactful results",
    university: "Daffodil International University",
    department: "CSE",
    interests: "Web development, Machine learning, Social marketing, Youtube SEO",
    contact_email: "ahmedsiam01608@gmail.com",
    location: "Mirpur 2, Dhaka, Bangladesh",
    linkedin_url: "https://www.linkedin.com/in/shiamahmed/",
    github_url: "https://github.com/siamahmed0011",
    facebook_link: "https://www.facebook.com/siam.ahmed.863154/",
    typing_roles: "Web Developer, Digital Marketer, Frontend Designer, Machine Learning Enthusiast",
    cv_file: "settings/placeholder_cv.pdf",
  };

  for (const [key, defaultValue] of Object.entries(standardDefaults)) {
    const existing = await prisma.setting.findUnique({ where: { key } });
    if (!existing) {
      await prisma.setting.create({
        data: {
          key,
          value: defaultValue,
        },
      });
    }
  }

  // 2. Migrate Projects
  if (Array.isArray(data.projects)) {
    console.log(`Migrating ${data.projects.length} projects...`);
    for (const item of data.projects as LegacyProject[]) {
      // Normalize image path if necessary (e.g. "projects/xxx.jpg" -> "/uploads/projects/xxx.jpg" or keep "projects/xxx.jpg")
      const existing = await prisma.project.findFirst({
        where: { title: item.title },
      });

      if (existing) {
        await prisma.project.update({
          where: { id: existing.id },
          data: {
            description: item.description ?? null,
            image: item.image ?? null,
            techStack: item.tech_stack ?? null,
            githubUrl: item.github_url ?? null,
            demoUrl: item.demo_url ?? null,
            updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
          },
        });
      } else {
        await prisma.project.create({
          data: {
            title: item.title,
            description: item.description ?? null,
            image: item.image ?? null,
            techStack: item.tech_stack ?? null,
            githubUrl: item.github_url ?? null,
            demoUrl: item.demo_url ?? null,
            createdAt: item.created_at ? new Date(item.created_at) : new Date(),
            updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
          },
        });
      }
    }
  }

  // 3. Migrate Skills
  if (Array.isArray(data.skills)) {
    console.log(`Migrating ${data.skills.length} skills...`);
    for (const item of data.skills as LegacySkill[]) {
      const existing = await prisma.skill.findFirst({
        where: { name: item.name },
      });

      if (existing) {
        await prisma.skill.update({
          where: { id: existing.id },
          data: {
            description: item.description ?? null,
            updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
          },
        });
      } else {
        await prisma.skill.create({
          data: {
            name: item.name,
            description: item.description ?? null,
            createdAt: item.created_at ? new Date(item.created_at) : new Date(),
            updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
          },
        });
      }
    }
  }

  // 4. Migrate Academics
  if (Array.isArray(data.academics)) {
    console.log(`Migrating ${data.academics.length} academic entries...`);
    for (const item of data.academics as LegacyAcademic[]) {
      const existing = await prisma.academic.findFirst({
        where: {
          degree: item.degree,
          institution: item.institution,
        },
      });

      if (existing) {
        await prisma.academic.update({
          where: { id: existing.id },
          data: {
            year: item.year,
            result: item.result ?? null,
            description: item.description ?? null,
            updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
          },
        });
      } else {
        await prisma.academic.create({
          data: {
            degree: item.degree,
            institution: item.institution,
            year: item.year,
            result: item.result ?? null,
            description: item.description ?? null,
            createdAt: item.created_at ? new Date(item.created_at) : new Date(),
            updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
          },
        });
      }
    }
  }

  // 5. Migrate Achievements
  if (Array.isArray(data.achievements)) {
    console.log(`Migrating ${data.achievements.length} achievements...`);
    for (const item of data.achievements as LegacyAchievement[]) {
      const existing = await prisma.achievement.findFirst({
        where: { title: item.title },
      });

      if (existing) {
        await prisma.achievement.update({
          where: { id: existing.id },
          data: {
            issuer: item.issuer ?? null,
            date: item.date ? new Date(item.date) : null,
            description: item.description ?? null,
            certificateUrl: item.certificate_url ?? null,
            updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
          },
        });
      } else {
        await prisma.achievement.create({
          data: {
            title: item.title,
            issuer: item.issuer ?? null,
            date: item.date ? new Date(item.date) : null,
            description: item.description ?? null,
            certificateUrl: item.certificate_url ?? null,
            createdAt: item.created_at ? new Date(item.created_at) : new Date(),
            updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
          },
        });
      }
    }
  }

  console.log("=== Legacy Data Migration Completed Successfully ===");
}

importLegacyData()
  .catch((err) => {
    console.error("Data migration error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
