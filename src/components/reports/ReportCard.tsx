import React, { useState } from "react";
import EditableText from "./EditableText";
interface Props {
  date: string;
  shift: string;
  data: Record<string, string[]>;
  onChange?: (updated: Record<string, string[]>) => void; // 🔥 notify parent
}

const Card: React.FC<{
  title: string;
  items: JSX.Element[];
}> = ({ title, items }) => {
  return (
    <div className="rounded-2xl shadow p-4 bg-slate-700 flex flex-col">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      {items.length > 0 ? (
        <div className="space-y-2">{items}</div>
      ) : (
        <div className="text-gray-400 text-sm italic">No data</div>
      )}
    </div>
  );
};

const ReportCard: React.FC<Props> = ({ date, shift, data, onChange }) => {
  const [localData, setLocalData] = useState(data);

  const updateItem = (section: string, index: number, newValue: string) => {
    const updated = { ...localData };
    updated[section][index] = newValue;
    setLocalData(updated);
    onChange?.(updated); // 🔥 push result to parent
  };

  const entries = Object.entries(localData);

  return (
    <div className="p-6 w-full space-y-6">
      <h1 className="text-2xl font-bold">{date}</h1>

      <div className="grid">
        <Card
          title={shift}
          items={entries.map(([key, arr]) => (
            <div key={key} className="mb-4">
              <h3 className="font-bold text-lg">{key}</h3>
              <ul className="ml-4 list-disc space-y-1">
                {arr.map((item, i) => (
                  <li key={i}>
                    <EditableText
                      text={item}
                      onSave={(val) => updateItem(key, i, val)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        />
      </div>
    </div>
  );
};

export default ReportCard;
