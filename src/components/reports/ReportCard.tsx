import React, { useState } from "react";
import EditableText from "./EditableText";

interface Props {
  date: string;
  shift: string;
  data: Record<string, string[]>;
  onChange?: (updated: Record<string, string[]>) => void;
}

/* ---------------------------------------------------
   FIXED CARD COMPONENT
--------------------------------------------------- */
type CardProps = {
  title?: string;
  items?: JSX.Element[];
  className?: string;
  children?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({
  title,
  items,
  className = "",
  children,
}) => {
  return (
    <div className={`rounded-2xl shadow p-4  flex flex-col ${className}`}>
      {/* If children exist → render children mode */}
      {children ? (
        children
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          {items && items.length > 0 ? (
            <div className="space-y-2 ">{items}</div>
          ) : (
            <div className="text-gray-400 text-sm italic">No data</div>
          )}
        </>
      )}
    </div>
  );
};

/* ---------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------- */
const ReportCard: React.FC<Props> = ({ date, shift, data, onChange }) => {
  const [localData, setLocalData] = useState(data);

  const updateItem = (section: string, index: number, newValue: string) => {
    const updated = { ...localData };
    updated[section][index] = newValue;
    setLocalData(updated);
    onChange?.(updated);
  };

  const entries = Object.entries(localData);

  return (
    <div className="p-6 w-full space-y-6 ">
      <h1 className="text-2xl font-bold">{date}</h1>

      <div className="grid gap-6">
        <Card className="p-4 bg-slate-800 rounded-xl shadow-lg">
          <h2 className="text-xl text-blue-700 font-bold mb-4 border-b border-s-sky-500 pb-2">
            {shift}
          </h2>

          {entries.map(([key, arr]) => (
            <div key={key} className="mb-6">
              <h3 className="font-bold text-sm text-blue-300 mb-2">{key}</h3>

              <ul className="space-y-2">
                {arr.map((item, i) => (
                  <li
                    key={i}
                    className="bg-gray-900 border border-gray-700 rounded-lg p-3 flex justify-between items-start"
                  >
                    <EditableText
                      text={item}
                      onSave={(val) => updateItem(key, i, val)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default ReportCard;
