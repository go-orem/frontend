import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const allowedTypes = ["image/", "video/", "application/pdf"];
    const results: any[] = [];

    for (const file of files) {
      if (!allowedTypes.some((t) => file.type.startsWith(t))) {
        return NextResponse.json(
          { error: "Unsupported file type" },
          { status: 415 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      results.push(result);
    }

    return NextResponse.json(
      { message: "Upload successful", data: results },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
