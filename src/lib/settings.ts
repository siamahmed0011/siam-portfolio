import prisma from "@/lib/prisma";

export interface PortfolioSettings {
  site_name: string;
  hero_title: string;
  hero_description: string;
  about_intro: string;
  university: string;
  department: string;
  interests: string;
  contact_email: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  facebook_link: string;
  typing_roles: string;
  cv_file: string | null;
  [key: string]: string | null;
}

const DEFAULTS: PortfolioSettings = {
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

export async function getPortfolioSettings(): Promise<PortfolioSettings> {
  try {
    const rows = await prisma.setting.findMany();
    const result: PortfolioSettings = { ...DEFAULTS };

    for (const row of rows) {
      if (row.value !== null) {
        result[row.key] = row.value;
      }
    }

    // Normalize potential case variations from Laravel seeders
    if (result.Contact_email && !result.contact_email) {
      result.contact_email = result.Contact_email;
    }
    if (result.Location && !result.location) {
      result.location = result.Location;
    }
    if (result.Facebook_link && !result.facebook_link) {
      result.facebook_link = result.Facebook_link;
    }

    return result;
  } catch (err: unknown) {
    console.error("Failed to fetch settings from DB, using fallback defaults:", err);
    return DEFAULTS;
  }
}
