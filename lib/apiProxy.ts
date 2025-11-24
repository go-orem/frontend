import { NextResponse } from "next/server";
import { getServerToken } from "./getServerToken";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

export async function proxyRequest(
  path: string,
  req: Request,
  methodOverride?: string
) {
  try {
    const url = `${BACKEND_URL}${path}`;

    const token = await getServerToken();

    const headers: Record<string, string> = {
      ...Object.fromEntries(req.headers),
    };

    if (token && !headers["authorization"]) {
      headers["authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: methodOverride || req.method,
      headers,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = { error: "Invalid JSON from backend" };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
