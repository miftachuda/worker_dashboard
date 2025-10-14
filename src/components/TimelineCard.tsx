import React from "react";

interface MaintenanceCardProps {
  title: string;
  description: string;
  image?: string;
  start_time: string;
  status: string;
}

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  title,
  description,
  image,
  start_time,
  status,
}) => {
  return (
    <div className="relative bg-neutral-900 text-white rounded-2xl shadow-lg p-4 w-72 hover:shadow-xl transition-all duration-200">
      {/* Title */}
      <h2 className="text-lg font-semibold text-center mb-2">{title}</h2>

      {/* Image */}
      {image && (
        <img
          src={`https://primefaces.org/cdn/primereact/images/product/${image}`}
          alt={title}
          className="w-full rounded-xl object-cover mb-3"
        />
      )}

      {/* Description */}
      <div className="text-sm text-neutral-300 bg-neutral-800/60 rounded-xl p-3 mb-8 border border-neutral-700 shadow-inner whitespace-pre-wrap text-left">
        {description}
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-3 left-4 text-xs text-neutral-400">
        {start_time}
      </div>
      <div
        className={`absolute bottom-3 right-4 text-xs font-semibold ${
          status === "Completed"
            ? "text-green-400"
            : status === "Pending"
            ? "text-yellow-400"
            : "text-red-400"
        }`}
      >
        {status}
      </div>
    </div>
  );
};

export default MaintenanceCard;
