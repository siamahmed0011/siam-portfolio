import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getPortfolioSettings } from "@/lib/settings";
import { getAssetUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPortfolioSettings();
  return {
    title: `About | ${settings.site_name}`,
    description: `Learn more about ${settings.site_name}, education, skill sets, and background.`,
  };
}

export default async function AboutPage() {
  const settings = await getPortfolioSettings();

  const [skills, latestAcademic] = await Promise.all([
    prisma.skill.findMany({
      orderBy: { id: "asc" },
    }),
    prisma.academic.findFirst({
      orderBy: { year: "desc" },
    }),
  ]);

  return (
    <section className="section">
      <div className="container about-grid">
        {/* Left Column */}
        <div>
          <h2 className="section-title">About</h2>

          <p className="muted mb-1">
            {settings.about_intro ||
              "Flutter Developer with hands-on experience building cross-platform mobile apps using Flutter and Firebase. Skilled in UI design, real-time databases, role-based systems, HTML, CSS, and JavaScript. Also proficient in Canva graphic design, AI video creation, and digital marketing. Seeking an entry-level Flutter Developer or Digital Marketing role to deliver impactful results"}
          </p>

          <div className="about-card">
            <h2>Profile</h2>
            {settings.university && (
              <p>
                <strong>University:</strong> {settings.university}
              </p>
            )}
            {settings.department && (
              <p>
                <strong>Department:</strong> {settings.department}
              </p>
            )}
            {settings.interests && (
              <p>
                <strong>Interests:</strong> {settings.interests}
              </p>
            )}
          </div>

          <div className="about-card">
            <h2>Education</h2>
            <div className="education-wrapper">
              {latestAcademic ? (
                <div className="edu-card">
                  <div className="edu-title">{latestAcademic.degree}</div>
                  <p className="edu-item">{latestAcademic.institution}</p>
                  <p className="edu-muted">
                    <strong>Year:</strong> {latestAcademic.year}
                  </p>
                  {latestAcademic.result && (
                    <p className="edu-muted">
                      <strong>Result:</strong> {latestAcademic.result}
                    </p>
                  )}
                </div>
              ) : (
                <p className="muted">No academic history available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="about-card">
            <h2>Skills &amp; Expertise</h2>

            <div className="skills-wrapper">
              {skills.length === 0 ? (
                <p className="muted">No skills listed yet.</p>
              ) : (
                skills.map((skill) => {
                  const techItems = skill.description
                    ? skill.description
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    : [];

                  return (
                    <div key={skill.id} className="skill-group">
                      <h4 className="skill-name-header">{skill.name}</h4>
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

          <div className="about-card">
            <h2>Contact Details</h2>
            {settings.contact_email && (
              <p>
                <strong>Email:</strong> {settings.contact_email}
              </p>
            )}
            {settings.location && (
              <p>
                <strong>Location:</strong> {settings.location}
              </p>
            )}
            {settings.cv_file && (
              <p style={{ marginTop: "1rem" }}>
                <a
                  href={getAssetUrl(settings.cv_file)}
                  className="btn btn-primary"
                  style={{
                    padding: "0.4rem 1.1rem",
                    fontSize: "0.85rem",
                    borderRadius: "8px",
                  }}
                  download
                >
                  Download Resume (CV)
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
