import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LarryLilog | Beyond The Walls. Into The Wildness.",
  description: "Deep dives on Human Growth. Spiritual Insight. Rational Wisdom & Independent Income.",
  keywords: ["blog", "personal growth", "spirituality", "rational wisdom", "independent income"],
  authors: [{ name: "Larry Li" }],
  openGraph: {
    title: "LarryLilog",
    description: "Beyond The Walls. Into The Wildness.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LarryLilog",
    description: "Beyond The Walls. Into The Wildness.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/imgs/author.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
