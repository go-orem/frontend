"use client";

import { useState } from "react";
import { uploadFiles } from "@/services/uploadService";

type UploadFormProps = {
  multiple?: boolean;
  maxSizeMB?: number;
  allowedTypes?: string[];
  onUpload?: (urls: string[]) => void;
};

export default function UploadForm({
  multiple = false,
  maxSizeMB = 5,
  allowedTypes = ["image/", "video/", "application/pdf"],
  onUpload,
}: UploadFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  function validateFiles(selected: File[]) {
    for (const file of selected) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File ${file.name} terlalu besar (max ${maxSizeMB}MB)`;
      }
      if (!allowedTypes.some((t) => file.type.startsWith(t))) {
        return `File ${file.name} tidak didukung`;
      }
    }
    return null;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);

    const previews = selected.map((file) =>
      file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
    );
    setPreviewUrls(previews);
  }

  async function handleUpload() {
    if (files.length === 0) return;

    const validationError = validateFiles(files);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadFiles(files);
      const arr = Array.isArray(result) ? result : [result];
      setResults(arr);

      if (onUpload) {
        const urls = arr.map((r: any) => r.secure_url);
        onUpload(urls);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className="w-full max-w-md mx-auto p-6 rounded-2xl border border-dashed border-gray-500 
                    bg-linear-to-br from-gray-900 via-gray-800 to-black shadow-lg"
    >
      {/* Input area */}
      <label
        className="flex flex-col items-center justify-center w-full h-32 cursor-pointer 
                   rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/50 
                   hover:border-cyan-400 hover:bg-gray-700/50 transition-all duration-300"
      >
        <span className="text-gray-300  text-sm">
          {multiple ? "Select multiple files" : "Select a file"}
        </span>
        <input
          type="file"
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Preview */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {files.map((file, i) =>
            file.type.startsWith("image/") ? (
              <div key={i} className="relative group">
                <img
                  src={previewUrls[i]}
                  alt={`preview-${i}`}
                  className="w-full h-20 object-cover rounded-lg border border-gray-600"
                />
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => {
                    const newFiles = files.filter((_, idx) => idx !== i);
                    const newPreviews = previewUrls.filter(
                      (_, idx) => idx !== i
                    );
                    setFiles(newFiles);
                    setPreviewUrls(newPreviews);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded 
                       opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                key={i}
                className="relative group flex items-center justify-center h-32 rounded-lg 
                     border border-gray-600 bg-gray-700 text-gray-200 text-sm "
              >
                📄 {file.name}
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => {
                    const newFiles = files.filter((_, idx) => idx !== i);
                    const newPreviews = previewUrls.filter(
                      (_, idx) => idx !== i
                    );
                    setFiles(newFiles);
                    setPreviewUrls(newPreviews);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded 
                       opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className="mt-4 w-full px-6 py-2.5 rounded-full  text-sm font-bold 
                   bg-linear-to-r from-cyan-500 to-blue-600 text-white neon-border 
                   hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,255,0.7)] 
                   transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {/* Error */}
      {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-green-400 font-semibold">Upload successful!</p>
          {results.map((r, i) => (
            <a
              key={i}
              href={r.secure_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-cyan-300 hover:text-cyan-100 underline text-sm"
            >
              {r.secure_url}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
