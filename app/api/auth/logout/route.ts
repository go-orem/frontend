import { proxyRequest } from "@/lib/apiProxy";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // forward ke backend untuk logout
  const result = await proxyRequest("/auth/logout", req);

  const response = NextResponse.json(await result.json(), {
    status: result.status,
  });

  // ✅ Delete cookie
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions: any = {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 0, // ✅ Set maxAge ke 0 untuk delete
  };

  // ✅ Set domain yang sama dengan login
  if (
    process.env.NEXT_PUBLIC_APP_URL &&
    !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
  ) {
    const url = new URL(process.env.NEXT_PUBLIC_APP_URL);
    const parts = url.hostname.split(".");
    if (parts.length >= 2) {
      cookieOptions.domain = "." + parts.slice(-2).join(".");
    }
  }

  response.cookies.set("token", "", cookieOptions);

  return response;
}
