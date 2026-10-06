import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Shiam Ahmed",
    default: "Home | Shiam Ahmed",
  },
  description:
    "Flutter Developer & Digital Marketer skilled in building cross-platform mobile apps, Canva graphic design, and modern web development.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
