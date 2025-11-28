import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  AuthProvider,
  GiftProvider,
  ModalChatProvider,
  ModalProvider,
} from "@/context";
import { FloatingMenuChat, SplashScreen } from "@/components/UI";
import { ClientLayout } from "@/components/layout";
import { WebSocketProvider } from "@/context/WebsocketContext";
import { ConversationProvider } from "@/context/ConversationContext";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <AuthProvider>
            <WebSocketProvider>
              <ModalProvider>
                <ConversationProvider>
                  <ModalChatProvider>
                    <GiftProvider>
                      <Toaster richColors closeButton />
                      <ClientLayout>
                        <SplashScreen>{children}</SplashScreen>
                      </ClientLayout>
                      <FloatingMenuChat />
                    </GiftProvider>
                  </ModalChatProvider>
                </ConversationProvider>
              </ModalProvider>
            </WebSocketProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
