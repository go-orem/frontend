export async function uploadFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("file", file));

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data.data;
}
