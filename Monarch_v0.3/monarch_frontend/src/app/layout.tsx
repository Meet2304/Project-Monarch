import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monarch",
  description: "Cost Analysis Tool",
  icons:{
    icon: [
      // Default light mode icon
      {url: '/icon-light mode.ico', type: 'image/x-icon', media: '(prefers-color-scheme: light)'},
      // Dark mode icon
      {url: '/icon-dark mode.ico', type: 'image/x-icon', media: '(prefers-color-scheme: dark)'},
    ]
  }
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
        {children}
      </body>
    </html>
  );
}
