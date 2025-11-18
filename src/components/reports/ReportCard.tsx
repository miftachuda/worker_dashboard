import React from "react";

// Example props type
// data: Record<string, string[]>;
// shift: string; // e.g. "Shift D"
// date: string; // e.g. "17/11/2025"

interface Props {
  date: string;
  shift: string;
  data: Record<string, string[]>;
}

const Card: React.FC<{ title: string; items: (string | JSX.Element)[] }> = ({
  title,
  items,
}) => {
  return (
    <div className="rounded-2xl shadow p-4 bg-slate-700 flex flex-col">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      {items.length > 0 ? (
        <ul className="list-disc ml-4 space-y-1 text-sm">
          {items.map((item, idx) => (
            <li key={idx}>{typeof item === "string" ? item : item}</li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-400 text-sm italic">No data</div>
      )}
    </div>
  );
};

const ReportCard: React.FC<Props> = ({ date, shift, data }) => {
  const entries = Object.entries(data);
  return (
    <div className="p-6 w-full space-y-6">
      <h1 className="text-2xl font-bold">{date}</h1>
      <div className="grid">
        <Card
          key={shift}
          title={shift}
          items={entries.map(([key, arr]) => (
            <div key={key} className="mb-4">
              <h3 className="font-bold text-lg">{key}</h3>
              <ul className="ml-4 list-disc">
                {arr.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        ></Card>
      </div>
    </div>
  );
};

export default ReportCard;
