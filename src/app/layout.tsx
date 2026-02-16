import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/session-provider";
import { WorkspaceProvider } from "@/components/providers/workspace-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InstaOutreachOS",
  description: "Scale your Instagram outreach compliantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <WorkspaceProvider>
            {children}
          </WorkspaceProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
