import { proxyRequest } from "@/lib/apiProxy";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // forward ke backend untuk logout
  const result = await proxyRequest("/auth/logout", req);

  // hapus cookie token di sisi Next.js
  const response = NextResponse.json(await result.json(), {
    status: result.status,
  });
  response.cookies.delete("token");

  return response;
}
