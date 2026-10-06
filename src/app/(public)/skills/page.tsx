import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getPortfolioSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPortfolioSettings();
  return {
    title: `Skills | ${settings.site_name}`,
    description: "Overview of technical skills, programming languages, tools, and expertise.",
  };
}

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">My Skills</h2>

        <div className="skills-grid">
          {skills.length === 0 ? (
            <p className="muted">No skills added yet.</p>
          ) : (
            skills.map((skill) => {
              const techItems = skill.description
                ? skill.description
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [];

              return (
                <div key={skill.id} className="skill-card">
                  <h4>{skill.name}</h4>
                  {techItems.length > 0 && (
                    <div className="tech-pills">
                      {techItems.map((item, idx) => (
                        <span key={idx} className="tech-pill">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
