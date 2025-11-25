import React from "react";
import Card2 from "./Card2.tsx";

type PspvCardsProps = {
  loading: boolean;
  lotoData: {
    id: number;
    tag_number: string;
    desc: string;
    created_at: string;
    isActive: boolean;
  }[];
  callback: () => void;
};

const PspvCards: React.FC<PspvCardsProps> = ({
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
          <Card2
            key={index}
            id={item.id}
            equipment={item.tag_number}
            description={item.desc}
            date={item.created_at}
            isActive={item.isActive}
            onClick={callback}
          />
        );
      })}
    </div>
  );
};

export default PspvCards;
