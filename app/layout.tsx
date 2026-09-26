import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbit IT Service Desk",
  description: "Enterprise IT service desk and asset operations prototype",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
