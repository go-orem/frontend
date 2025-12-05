import { proxyRequest } from "@/lib/apiProxy";

export async function PUT(
  req: Request,
  context: { params: Promise<{ userId: string; contactId: string }> }
) {
  const { userId, contactId } = await context.params;
  return proxyRequest(`/users/${userId}/contacts/${contactId}`, req);
}
