export async function handleResponse(res: Response) {
  const json = await res.json();

  if (!res.ok) {
    const error = new Error(json?.error?.message || "Request failed");
    (error as any).code = json?.error?.code;
    (error as any).details = json?.error;
    throw error;
  }

  return json.data ?? json;
}
