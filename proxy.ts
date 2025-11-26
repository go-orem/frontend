import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (req.nextUrl.pathname.startsWith("/channel")) {
    if (!token) {
      return NextResponse.redirect(new URL("/channel-public", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/channel/:path*"],
};
