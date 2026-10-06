import type { Metadata } from "next";
import { getPortfolioSettings } from "@/lib/settings";
import { ContactForm } from "@/components/public/contact-form";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPortfolioSettings();
  return {
    title: `Contact | ${settings.site_name}`,
    description: `Get in touch with ${settings.site_name} for projects, collaborations, or inquiries.`,
  };
}

export default async function ContactPage() {
  const settings = await getPortfolioSettings();

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <p className="muted mb-1">
          Have a question, an opportunity, or just want to say hi? Send me a message below.
        </p>

        <div className="contact-grid">
          {/* Contact Information Card */}
          <div className="contact-card" style={{ margin: 0 }}>
            <h2 className="section-title contact-title">Contact Information</h2>

            {settings.contact_email && (
              <p className="contact-row">
                <span className="contact-label">Email</span>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="contact-value"
                >
                  {settings.contact_email}
                </a>
              </p>
            )}

            {settings.linkedin_url && (
              <p className="contact-row">
                <span className="contact-label">LinkedIn</span>
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-value linkedin-link"
                >
                  Visit My LinkedIn Profile
                </a>
              </p>
            )}

            {settings.github_url && (
              <p className="contact-row">
                <span className="contact-label">GitHub</span>
                <a
                  href={settings.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-value"
                >
                  View My GitHub
                </a>
              </p>
            )}

            {settings.location && (
              <p className="contact-row">
                <span className="contact-label">Location</span>
                <span className="contact-value">{settings.location}</span>
              </p>
            )}

            <p className="contact-note">
              Feel free to contact me for collaboration, internship, or job opportunities.
            </p>
          </div>

          {/* Message Form Card */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
