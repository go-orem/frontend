import { NextResponse } from "next/server";
import { getServerToken } from "@/lib/getServerToken";

export async function GET() {
  const token = await getServerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // penting kalau backend Go butuh session atau cookie
      credentials: "include",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
