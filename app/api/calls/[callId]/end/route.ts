import { proxyRequest } from "@/lib/apiProxy";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ callId: string }> }
) {
  const { callId } = await context.params;
  return proxyRequest(`/calls/${callId}/end`, req);
}
