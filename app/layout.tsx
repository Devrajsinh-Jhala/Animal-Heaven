import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Animal Heaven",
  description:
    "Explore animal heaven courses, delve into captivating blogs, and join our vibrant community. Expand your knowledge, connect with like-minded individuals, and make a positive impact on the lives of animals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <Navbar />
            {children}
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
