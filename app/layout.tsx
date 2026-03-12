import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live2D Player",
  description: "Standalone Live2D player with preset dialogues",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <head>
        <script src="/sentio/core/live2dcubismcore.min.js" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
