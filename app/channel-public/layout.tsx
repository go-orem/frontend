// app/channel-public/layout.tsx
"use client";

export default function PublicChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[--background] text-[--foreground]">
      {children}
    </div>
  );
}
