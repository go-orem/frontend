import { NextResponse } from "next/server";
import { getServerToken } from "@/lib/getServerToken";

export async function POST(req: Request) {
  const token = await getServerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  let data: any = {};
  try {
    data = await res.json();
  } catch {
    // backend tidak mengembalikan JSON
    data = { message: "Logged out" };
  }

  // jika backend error → teruskan ke client
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  // hapus cookie token dengan opsi yang sama seperti set()
  const response = NextResponse.json(data);
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
