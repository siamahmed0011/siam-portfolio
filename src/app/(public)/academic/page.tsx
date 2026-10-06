import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getPortfolioSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPortfolioSettings();
  return {
    title: `Academic Journey | ${settings.site_name}`,
    description: "Educational qualifications, degrees, and academic milestones.",
  };
}

export default async function AcademicPage() {
  const academics = await prisma.academic.findMany({
    orderBy: { year: "desc" },
  });

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "800px" }}>
        <h2 className="section-title">Academic Journey</h2>
        <p className="muted mb-1">
          My educational background and qualifications.
        </p>

        <div className="timeline">
          {academics.length === 0 ? (
            <p className="muted">No academic history added yet.</p>
          ) : (
            academics.map((academic) => (
              <div key={academic.id} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-body">
                  <h4>{academic.degree}</h4>
                  <p className="institution">{academic.institution}</p>
                  {academic.result && (
                    <p className="result">
                      Result: <strong>{academic.result}</strong>
                    </p>
                  )}
                  <span className="tech-pill">Year: {academic.year || "N/A"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
