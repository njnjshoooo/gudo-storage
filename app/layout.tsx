import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

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
      {/* pb-20 = 56px nav + 24px buffer + iOS safe area via BottomNav */}
      <body className="min-h-screen pb-20">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
