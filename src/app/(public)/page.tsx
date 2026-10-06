import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { getPortfolioSettings } from "@/lib/settings";
import { getAssetUrl } from "@/lib/utils";
import { TypingEffect } from "@/components/public/typing-effect";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPortfolioSettings();
  return {
    title: `Home | ${settings.site_name}`,
    description: settings.hero_description,
  };
}

export default async function HomePage() {
  const settings = await getPortfolioSettings();

  // In Laravel: orderByRaw("CASE WHEN title = 'Food Waste Reduce' THEN 0 ELSE 1 END")->latest()->take(3)
  const allProjects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Replicate Laravel custom project priority: "Food Waste Reduce" first
  const sortedProjects = [...allProjects].sort((a, b) => {
    if (a.title === "Food Waste Reduce") return -1;
    if (b.title === "Food Waste Reduce") return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const featuredProjects = sortedProjects.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <p className="eyebrow">
              HI, I&apos;M <TypingEffect rolesString={settings.typing_roles} />
            </p>

            <h1>{settings.site_name || "Shiam Ahmed"}</h1>

            <p className="hero-subtitle">
              {settings.hero_description ||
                "Flutter Developer & Digital Marketer skilled in building cross-platform mobile apps, Canva graphic design, and modern web development"}
            </p>

            <div className="hero-actions">
              <Link href="/projects" className="btn btn-primary">
                View My Projects
              </Link>
              <Link href="/about" className="btn btn-outline">
                About Me
              </Link>
              {settings.cv_file && (
                <a
                  href={getAssetUrl(settings.cv_file)}
                  className="btn btn-outline"
                  download
                >
                  Download CV
                </a>
              )}
            </div>
          </div>

          <div className="hero-avatar-wrap">
            <div className="hero-avatar">
              <Image
                src="/images/profile.jpg"
                alt="Profile Image"
                width={240}
                height={240}
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="section featured-projects">
        <h2 className="section-title">Featured Projects</h2>

        <div className="card-grid">
          {featuredProjects.length === 0 ? (
            <p className="muted">No projects added yet.</p>
          ) : (
            featuredProjects.map((project) => {
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
      </section>
    </>
  );
}
