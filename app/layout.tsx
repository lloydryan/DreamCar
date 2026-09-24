import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dream 911",
  description: "A personal savings tracker for a dream Porsche 911.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
