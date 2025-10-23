import React, { useState } from "react";
import { pb } from "../lib/pocketbase";
import { X, Upload } from "lucide-react";

interface UploadItem {
  file: File;
  preview: string;
  progress: number;
  uploadedUrl?: string;
  isUploading: boolean;
}

const MAX_FILES = 9;

const MultiImageUploadPB = () => {
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [saving, setSaving] = useState(false);

  // ---- Handle File Selection ----
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (files.length + selected.length > MAX_FILES) {
      alert(`Maksimal ${MAX_FILES} foto`);
      return;
    }

    const newFiles = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      isUploading: false,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  // ---- Remove File ----
  const handleRemove = (index: number) => {
    const file = files[index];
    if (file.uploadedUrl) {
      const path = file.uploadedUrl.split(
        "/storage/files/images_collection/"
      )[1];
      if (path)
        pb.collection("images_collection")
          .delete(path)
          .catch(() => {});
    }
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ---- Upload with Progress ----
  const uploadFile = async (item: UploadItem, index: number) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("images", item.file);

      xhr.open(
        "POST",
        `${pb.baseUrl}/api/collections/images_collection/records`
      );

      xhr.setRequestHeader("Authorization", pb.authStore.token || "");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setFiles((prev) =>
            prev.map((f, i) => (i === index ? { ...f, progress: percent } : f))
          );
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const record = JSON.parse(xhr.responseText);
          const url = pb.files.getUrl(record, record.images[0]);
          setFiles((prev) =>
            prev.map((f, i) =>
              i === index
                ? { ...f, uploadedUrl: url, isUploading: false, progress: 100 }
                : f
            )
          );
          resolve();
        } else reject(xhr.statusText);
      };

      xhr.onerror = () => reject("Upload failed");
      setFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, isUploading: true } : f))
      );
      xhr.send(formData);
    });
  };

  // ---- Save all ----
  const handleSave = async () => {
    if (files.length === 0) return alert("Tambahkan minimal 1 foto");
    setSaving(true);

    try {
      for (let i = 0; i < files.length; i++) {
        if (!files[i].uploadedUrl) await uploadFile(files[i], i);
      }
      alert("Semua foto berhasil diunggah!");
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah foto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg w-full max-w-2xl ">
      <div className="grid grid-cols-5 gap-3">
        {files.map((item, i) => (
          <div
            key={i}
            className="relative group rounded-md border overflow-hidden aspect-square "
          >
            <img
              src={item.preview}
              alt=""
              className="object-cover w-full h-full"
            />

            {/* Delete Button */}
            <button
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
            >
              <X size={14} />
            </button>

            {/* Progress Bar */}
            {item.isUploading && (
              <div className="absolute bottom-0 left-0 w-full bg-gray-200 h-1">
                <div
                  className="bg-blue-500 h-1 transition-all"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}

        {/* Add Image Button */}
        {files.length < MAX_FILES && (
          <label className="border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center text-gray-500 cursor-pointer ">
            <Upload className="w-6 h-6 mb-1" />
            <span className="text-xs">
              Tambahkan Foto ({files.length}/{MAX_FILES})
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
