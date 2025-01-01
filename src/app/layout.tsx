import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { Sidebar } from '@/components/layout/sidebar';
// import { TopNav } from '@/components/layout/top-nav';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Management System",
  description: "This is a task management system for the company job assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex">
          {/* <Sidebar />
          <div className="flex-1">
            <TopNav /> */}
            <main>
              {children}
            </main>
          {/* </div> */}
        </div>
      </body>
    </html>
  );
}
