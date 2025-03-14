import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Logo } from "@/components/ui/logo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Compare Foods Careers",
  description: "Join our team at Compare Foods Supermarket",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
