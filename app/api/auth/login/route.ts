import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const response = NextResponse.json(data);

  const token = data.data?.token;
  if (token) {
    const cookieOptions: any = {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    };

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

    response.cookies.set("token", token, cookieOptions);
  }

  return response;
}
