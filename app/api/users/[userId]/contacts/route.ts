import { proxyRequest } from "@/lib/apiProxy";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  console.log("GET contacts for user:", userId);
  return proxyRequest(`/users/${userId}/contacts`, req);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  return proxyRequest(`/users/${userId}/contacts`, req);
}
