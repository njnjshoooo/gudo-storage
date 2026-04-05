import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GUDO 收納品工具站",
  description: "整聊師收納工具站 — 量尺寸、看方案、管出貨、分享成果",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
