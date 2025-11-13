import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "./components/UI/modal/ModalContext";
import FloatingMenu from "./components/UI/modal/FloatingMenu";
import { GiftProvider } from "./components/UI/modal/GiftContext";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orem",
  description: "Situs untuk komunikasi dengan teman seluruh dunia",
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
        <AuthProvider>
          <ModalProvider>
            <GiftProvider>
              <Toaster richColors closeButton />
              {children}
              <FloatingMenu />
            </GiftProvider>
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
