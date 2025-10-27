import React, { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { pb } from "@/lib/pocketbase";
import { RecordModel } from "pocketbase";
import { ToastContainer, toast } from "react-toastify";

// This interface defines the objects we'll use for previews
interface PreviewObject {
  url: string; // URL for the <img> src
  source: string | File; // The data: string (filename) or File (new upload)
}

interface MultiImageUploadPBEditProps {
  form: any;
  setForm: (form: any) => void;
  record: RecordModel; // The full record to get existing images
  fieldName: string; // e.g., "photo"
  maxFiles?: number;
}

const MultiImageUploadPBEdit: React.FC<MultiImageUploadPBEditProps> = ({
  form,
  setForm,
  record,
  fieldName,
  maxFiles = 9,
}) => {
  const [previews, setPreviews] = useState<PreviewObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Initialize previews from existing record files
  useEffect(() => {
    const existingFiles = record[fieldName] || []; // e.g., items.photo
    const initialPreviews = existingFiles.map((filename: string) => ({
      url: pb.files.getUrl(record, filename),
      source: filename, // The source is the original filename string
    }));
    setPreviews(initialPreviews);
    // Note: We don't set the form here, because the parent 'form'
    // already has the initial filenames [items.photo].
  }, [record, fieldName]); // Only run when the record prop changes

  // 2. Handle *new* file selection
  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const selected = e.target.files ? Array.from(e.target.files) : [];

    try {
      const compressedFiles = await Promise.all(
        selected.map(async (file) => {
          const compressed = await imageCompression(file, {
            maxWidthOrHeight: 1280,
            useWebWorker: true,
          });
          return compressed;
        })
      );

      const newPreviews = compressedFiles.map((file) => ({
        url: URL.createObjectURL(file), // Create a temporary local URL
        source: file, // The source is the new File object
      }));

      // Combine old and new previews
      const allPreviews = [...previews, ...newPreviews];
      setPreviews(allPreviews);

      // Update the parent form's 'photo' array
      const allSources = allPreviews.map((p) => p.source);
      setForm({ ...form, [fieldName]: allSources });
    } catch (error) {
      toast.error("Failed to process image");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle *removal* of ANY file (existing or new)
  const handleRemove = (index: number) => {
    const itemToRemove = previews[index];

    // Clean up memory by revoking Object URL if it was a new File
    if (itemToRemove.source instanceof File) {
      URL.revokeObjectURL(itemToRemove.url);
    }

    // Filter out the removed item
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);

    // Update the parent form's 'photo' array with the new list
    const updatedSources = updatedPreviews.map((p) => p.source);
    setForm({ ...form, [fieldName]: updatedSources });
  };

  const currentFilesCount = previews.length;

  return (
    <div className="p-4 border rounded-lg w-full">
      <div className="grid grid-cols-5 gap-3">
        {previews.map((preview, i) => (
          <div
            key={i} // Using index is fine here as long as we don't re-order
            className="relative group rounded-md border overflow-hidden aspect-square"
          >
            <img
              src={preview.url}
              alt="Upload preview"
              className="object-cover w-full h-full"
            />
            {/* Delete Button */}
            <button
              type="button" // Add type="button" to prevent form submission
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-6 h-6 mb-1 animate-spin" />
            <span className="text-xs">Processing...</span>
          </div>
        )}

        {/* Add Image Button */}
        {!isLoading && currentFilesCount < maxFiles && (
          <label className="border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center text-gray-500 cursor-pointer">
            <Upload className="w-6 h-6 mb-1" />
            <span className="text-xs">
              Tambahkan Foto ({currentFilesCount}/{maxFiles})
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

export default MultiImageUploadPBEdit;
