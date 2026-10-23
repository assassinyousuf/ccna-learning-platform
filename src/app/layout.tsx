import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FirebaseAnalyticsProvider } from "@/components/FirebaseAnalyticsProvider";

export const metadata: Metadata = {
  title: "CCNA 200-301 Mastery: Cohort-Based Learning & Video Verification",
  description:
    "Master the Cisco CCNA 200-301 curriculum with structured modules, rigorous quizzes, and proof-of-skill video submissions backed by Google Drive and Google Sheets.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('ccna_theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.style.colorScheme = 'light';
                } else {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] flex flex-col min-h-screen selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)] transition-colors duration-200">
        <Providers>
          <FirebaseAnalyticsProvider />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
