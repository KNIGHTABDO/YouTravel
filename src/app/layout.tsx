import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouTravel | AI-Powered Travel Research",
  description: "Autonomous AI travel research agent that creates premium travel guides from a single destination input",
  keywords: ["travel", "AI", "travel guide", "destination research", "trip planning"],
  authors: [{ name: "YouTravel" }],
  openGraph: {
    title: "YouTravel | AI-Powered Travel Research",
    description: "Autonomous AI travel research agent that creates premium travel guides",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
