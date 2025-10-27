import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";

interface MultiImageUploadPBProps {
  form: any;
  setForm: (form: any) => void;
  maxFiles?: number;
}

const MultiImageUploadPB: React.FC<MultiImageUploadPBProps> = ({
  form,
  setForm,
  maxFiles = 9,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);

  // ---- Handle File Selection ----
  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length === 0) return;

    // Limit total count
    const remainingSlots = maxFiles - (form.photo?.length || 0);
    const limitedFiles = selected.slice(0, remainingSlots);

    try {
      const compressedFiles = await Promise.all(
        limitedFiles.map(async (file) => {
          // ✅ Set max size & quality for smoother UX
          const compressed = await imageCompression(file, {
            maxWidthOrHeight: 1280,
            maxSizeMB: 1, // optional limit
            useWebWorker: true,
          });
          return compressed;
        })
      );

      // Generate preview URLs
      const newPreviews = compressedFiles.map((f) => URL.createObjectURL(f));

      // Update both form and local previews
      setPreviews((prev) => [...prev, ...newPreviews]);
      setForm((prev: any) => ({
        ...prev,
        photo: [...(prev.photo || []), ...compressedFiles],
      }));
    } catch (err) {
      toast.error("Failed to process image");
    } finally {
      // Reset input value so user can reselect same file if needed
      e.target.value = "";
    }
  };

  // ---- Remove File ----
  const handleRemove = (index: number) => {
    const updatedFiles = (form.photo || []).filter(
      (_: any, i: number) => i !== index
    );
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setForm((prev: any) => ({
      ...prev,
      photo: updatedFiles,
    }));

    setPreviews(updatedPreviews);
  };

  return (
    <div className="p-4 border rounded-lg w-full max-w-2xl">
      <div className="grid grid-cols-5 gap-3">
        {previews.map((preview, i) => (
          <div
            key={i}
            className="relative group rounded-md border overflow-hidden aspect-square"
          >
            <img
              src={preview}
              alt={`preview-${i}`}
              className="object-cover w-full h-full"
            />

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Add Image Button */}
        {(form.photo?.length || 0) < maxFiles && (
          <label className="border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <Upload className="w-6 h-6 mb-1" />
            <span className="text-xs text-center px-1">
              Tambah Foto ({form.photo?.length || 0}/{maxFiles})
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleSelect}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default MultiImageUploadPB;
