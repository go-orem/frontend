import { proxyRequest } from "@/lib/apiProxy";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{ messageId: string; attachmentId: string }>;
  }
) {
  const { messageId, attachmentId } = await context.params;
  return proxyRequest(
    `/messages/${messageId}/attachments/${attachmentId}`,
    req
  );
}
