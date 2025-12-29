import { proxyRequest } from "@/lib/apiProxy";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const result = await proxyRequest("/auth/logout", req);
  const data = await result.json();

  const response = NextResponse.json(data, { status: result.status });

  // Delete cookie dengan exact same config sebagai set cookie
  const isProduction = process.env.NODE_ENV === "production";
  const domain =
    isProduction && process.env.NEXT_PUBLIC_APP_URL?.includes("oremchat.com")
      ? ".oremchat.com"
      : undefined;

  response.cookies.set("token", "", {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    domain,
    expires: new Date(0), // Expire immediately
  });

  return response;
}
