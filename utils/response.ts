export async function handleResponse(res: Response) {
  let json: any = null;

  try {
    json = await res.json();
  } catch (err) {
    // ❌ JSON parse failed, body might be empty
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return null;
  }

  // ✅ FIX: Check response status
  if (!res.ok) {
    // ✅ Extract error message from multiple possible formats
    const message =
      json?.error?.message ||
      json?.message ||
      json?.msg ||
      res.statusText ||
      "Request failed";

    const code = json?.error?.code || null;

    // ✅ Handle auth errors
    if (res.status === 401 || code === "UNAUTHORIZED") {
      const err = new Error("UNAUTHORIZED");
      (err as any).authError = true;
      throw err;
    }

    // ✅ Create proper error object
    const error = new Error(message);
    (error as any).code = code;
    (error as any).status = res.status;
    (error as any).details = json?.error;
    throw error;
  }

  // ✅ Success: return data or full response
  return json?.data ?? json;
}

export function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Unknown error occurred";
}
