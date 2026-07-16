"use client";

import { useState } from "react";
import { uploadBackdropImage } from "@/lib/services/backdrops";

type BackdropUploadProps = {
  onUploadSuccess?: (url: string) => void;
};

export function BackdropUpload({ onUploadSuccess }: BackdropUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState<string>("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const url = await uploadBackdropImage(file);
      setSuccess("✓ Backdrop uploaded successfully!");
      onUploadSuccess?.(url);
      setTimeout(() => {
        setSuccess("");
        setPreview("");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border-2 border-teal-600">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        📸 Upload Activity Backdrop
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Choose Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="w-full border-2 border-dashed rounded-lg p-4 text-sm cursor-pointer disabled:opacity-50"
        />
      </div>

      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm p-2 bg-red-50 rounded-lg mb-2">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-600 text-sm p-2 bg-green-50 rounded-lg">
          {success}
        </div>
      )}

      <p className="text-xs text-slate-500 mt-2">
        💡 Recommended: Use a high-quality image (1920x1080 or larger)
      </p>
    </div>
  );
}
