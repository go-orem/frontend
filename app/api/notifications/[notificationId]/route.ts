import { proxyRequest } from "@/lib/apiProxy";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ notificationId: string }> }
) {
  const { notificationId } = await context.params;
  return proxyRequest(`/notifications/${notificationId}/read`, req);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ notificationId: string }> }
) {
  const { notificationId } = await context.params;
  return proxyRequest(`/notifications/${notificationId}`, req);
}
