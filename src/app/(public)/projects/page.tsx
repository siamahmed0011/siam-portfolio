import type { Metadata } from "next";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { getPortfolioSettings } from "@/lib/settings";
import { getAssetUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPortfolioSettings();
  return {
    title: `Projects | ${settings.site_name}`,
    description: "Explore all showcased web applications and software projects.",
  };
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        <p className="muted mb-1">
          Some of the projects that showcase my skills and interests.
        </p>

        <div className="card-grid">
          {projects.length === 0 ? (
            <p className="muted">No projects added yet.</p>
          ) : (
            projects.map((project) => {
              const techList = project.techStack
                ? project.techStack
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [];

              const primaryLink = project.demoUrl || project.githubUrl;

              return (
                <div key={project.id} className="card">
                  {project.image && (
                    primaryLink ? (
                      <a
                        href={primaryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={getAssetUrl(project.image)}
                          alt={project.title}
                          width={400}
                          height={200}
                          className="project-thumb"
                          unoptimized
                        />
                      </a>
                    ) : (
                      <Image
                        src={getAssetUrl(project.image)}
                        alt={project.title}
                        width={400}
                        height={200}
                        className="project-thumb"
                        unoptimized
                      />
                    )
                  )}

                  <h4>{project.title}</h4>

                  {techList.length > 0 && (
                    <div className="tech-pills">
                      {techList.map((tech, idx) => (
                        <span key={idx} className="tech-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.description && (
                    <p className="muted">
                      {project.description.length > 120
                        ? `${project.description.slice(0, 120)}...`
                        : project.description}
                    </p>
                  )}

                  <div className="card-links">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-sm"
                      >
                        GitHub &rarr;
                      </a>
                    )}

                    {project.demoUrl && project.demoUrl !== "#" && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-sm"
                      >
                        Live Demo &rarr;
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
