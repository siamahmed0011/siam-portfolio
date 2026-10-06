import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getPortfolioSettings } from "@/lib/settings";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPortfolioSettings();
  return {
    title: `Achievements | ${settings.site_name}`,
    description: "Competitions, awards, certifications, and recognitions.",
  };
}

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Achievements</h2>
        <p className="muted mb-1">
          Competitions, awards and recognitions I&apos;m proud of.
        </p>

        <div className="card-grid">
          {achievements.length === 0 ? (
            <p className="muted">No achievements added yet.</p>
          ) : (
            achievements.map((item) => (
              <div key={item.id} className="card">
                <h4>{item.title}</h4>

                {(item.issuer || item.date) && (
                  <p className="muted" style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                    {item.issuer && <span>{item.issuer}</span>}
                    {item.issuer && item.date && <span> &middot; </span>}
                    {item.date && <span>{formatDate(item.date)}</span>}
                  </p>
                )}

                {item.description && <p className="muted">{item.description}</p>}

                {item.certificateUrl && (
                  <div className="card-links">
                    <a
                      href={item.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-sm"
                    >
                      View Certificate &rarr;
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
