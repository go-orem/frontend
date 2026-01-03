import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  AuthProvider,
  ConversationProvider,
  GiftProvider,
  ModalChatProvider,
  ModalProvider,
  WebSocketProvider,
} from "@/context";
import { FloatingMenuChat, SplashScreen } from "@/components/UI";
import { ClientLayout } from "@/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oremchat",
  description: "Communicate with a global community for decentralized chats",
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
