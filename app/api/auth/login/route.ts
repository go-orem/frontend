import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // forward ke backend Go
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  // backend Go sudah balikin { user, token }
  // simpan token di cookie supaya middleware bisa baca
  const response = NextResponse.json(data);
  response.cookies.set("token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response;
}
