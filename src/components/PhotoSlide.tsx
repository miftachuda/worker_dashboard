import React, { useState } from "react";
import { motion } from "framer-motion";

interface PreviewPhotoSliderProps {
  images: string[]; // array of image URLs
  width?: string; // optional Tailwind width (default w-64)
  height?: string; // optional Tailwind height (default h-40)
}

export const PreviewPhotoSlider: React.FC<PreviewPhotoSliderProps> = ({
  images,
  width = "w-64",
  height = "h-40",
}) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${width} ${height} bg-gray-100 text-gray-500 rounded-lg`}
      >
        No images
      </div>
    );
  }

  const prevIndex = (index - 1 + images.length) % images.length;
  const nextIndex = (index + 1) % images.length;

  const handlePrev = () => setIndex(prevIndex);
  const handleNext = () => setIndex(nextIndex);

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Left Preview */}
      <motion.img
        key={`left-${prevIndex}`}
        src={images[prevIndex]}
        alt="Previous"
        className="w-20 h-20 object-cover rounded-lg opacity-50 cursor-pointer hover:opacity-80"
        onClick={handlePrev}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 0.5, x: 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Main Image */}
      <div
        className={`relative overflow-hidden rounded-xl shadow-md ${width} ${height}`}
      >
        <motion.img
          key={index}
          src={images[index]}
          alt="Main"
          className="absolute w-full h-full object-cover"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full px-2 py-1 text-sm"
        >
          ‹
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full px-2 py-1 text-sm"
        >
          ›
        </button>
      </div>

      {/* Right Preview */}
      <motion.img
        key={`right-${nextIndex}`}
        src={images[nextIndex]}
        alt="Next"
        className="w-20 h-20 object-cover rounded-lg opacity-50 cursor-pointer hover:opacity-80"
        onClick={handleNext}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 0.5, x: 0 }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
};
