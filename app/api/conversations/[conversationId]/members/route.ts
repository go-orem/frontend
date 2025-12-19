import { proxyRequest } from "@/lib/apiProxy";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await context.params;
  return proxyRequest(`/conversations/${conversationId}/members`, req);
}
