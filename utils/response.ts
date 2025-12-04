export async function handleResponse(res: Response) {
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const message = json?.error?.message || "Request failed";
    const code = json?.error?.code;

    if (res.status === 401 || code === "UNAUTHORIZED") {
      const err = new Error("UNAUTHORIZED");
      (err as any).authError = true;
      throw err;
    }

    const error = new Error(message);
    (error as any).code = code;
    (error as any).details = json?.error;
    throw error;
  }

  return json?.data ?? json;
}

export function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Failed to create category";
}
