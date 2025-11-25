import React, { useState } from "react";
import { LockKeyhole, UnlockKeyhole, CircleX } from "lucide-react";
import BreathingRedDot from "./Redot.tsx";
import disabled from "../../assets/disabled.svg";
import { supabase } from "./SupabaseClient";

interface CardProps {
  id: number;
  equipment: string;
  description: string;
  date: string;
  isActive: boolean;
  onClick: () => void;
}

function timeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // difference in seconds

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

const Card: React.FC<CardProps> = ({
  id,
  equipment,
  description,
  date,
  isActive,
  onClick,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCloseClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    await supabase.from("pspv").update({ isActive: false }).eq("id", id);
    onClick();
    console.log("Closed confirmed"); // replace with real logic
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="bg-navy-800 text-white p-4 rounded-md w-full flex flex-col shadow-lg relative">
      {isActive && (
        <img
          className="absolute top-0 right-0 h-16"
          src={disabled}
          alt="disabled"
        />
      )}
      <div className="flex items-center space-x-4">
        <div className="flex-row">
          <div className="bg-gray-700 p-3 rounded-full flex flex-col items-center justify-center">
            {isActive ? (
              <LockKeyhole className="text-red-400 w-6 h-6" />
            ) : (
              <UnlockKeyhole className="text-green-400 w-6 h-6" />
            )}

            {/* Show button only when active */}
          </div>
          {isActive && (
            <button
              onClick={handleCloseClick}
              className="mt-2 text-xs text-white bg-slate-400 px-2 py-1 rounded hover:bg-red-100"
            >
              <CircleX className="text-neutral-800 w-8 h-6" />
            </button>
          )}
        </div>
        <div className="w-full">
          <div className="flex items-center space-x-2">
            <div className="text-xl font-semibold">{equipment}</div>
            {isActive && <BreathingRedDot />}
          </div>
          <div className="mt-1 bg-gray-600 bg-opacity-40 text-gray-200 px-3 py-1 rounded-md h-20 w-full flex items-start justify-start text-sm overflow-hidden">
            {description}
          </div>
        </div>
      </div>

      <div className="h-2 w-full"></div>

      {date && (
        <div className="absolute bottom-2 right-3 text-xs text-gray-400">
          {timeAgo(date)}
        </div>
      )}

      {/* Confirmation popup */}
      {showConfirm && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-4 rounded-md shadow-lg">
            <p className="mb-4">
              Are you sure you want to close this PSPV Record?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
