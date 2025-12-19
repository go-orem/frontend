import { proxyRequest } from "@/lib/apiProxy";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ conversationId: string; memberId: string }> }
) {
  const { conversationId, memberId } = await context.params;
  return proxyRequest(
    `/conversations/${conversationId}/members/${memberId}/key`,
    req
  );
}
