import { proxyRequest } from "@/lib/apiProxy";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  return proxyRequest(`/users/${userId}/profile`, req);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  return proxyRequest(`/users/${userId}/profile`, req);
}
