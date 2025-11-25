import React from "react";
import Card from "./Card";

type LotoCardsProps = {
  loading: boolean;
  lotoData: {
    id: number;
    equipment: string;
    desc: string;
    created_at: string;
    isActive: boolean;
    lotoNumber: number;
  }[];
  callback: () => void;
};

const LotoCards: React.FC<LotoCardsProps> = ({
  loading,
  lotoData,
  callback,
}) => {
  if (loading) return <p>Loading...</p>;
  if (lotoData.length == 0) return <p>No Records</p>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {lotoData.map((item, index) => {
        // console.log(item); // This will log each item to the console

        return (
          <Card
            key={index}
            id={item.id}
            equipment={item.equipment}
            description={item.desc}
            date={item.created_at}
            isActive={item.isActive}
            lotoNumber={item.lotoNumber}
            onClick={callback}
          />
        );
      })}
    </div>
  );
};

export default LotoCards;
