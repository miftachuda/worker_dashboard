import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.locale("id");

const CardList = ({ data }: { data: any }) => {
  const sortedData = [...data].sort(
    (a, b) =>
      new Date(b.time * 1000).getTime() - new Date(a.time * 1000).getTime()
  );

  return (
    <div className="w-full mt-2 flex flex-col gap-3">
      {sortedData.map((item, index) => {
        const isNew = dayjs().diff(dayjs(item.time * 1000), "hour") <= 24;

        return (
          <div
            key={index}
            className={`w-full rounded-lg shadow-md p-4 border transition-all
              ${
                isNew
                  ? "bg-blue-950 border-blue-500 ring-2 ring-blue-400"
                  : "bg-gray-900 border-gray-700"
              }
            `}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">Make Up</p>

                  {isNew && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold animate-pulse">
                      NEW
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500">{item.chemical_name}</p>
                <p className="bg-gray-950 rounded-sm px-2 py-1 text-sm text-gray-400">
                  {item.description}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-xl font-bold text-blue-600">
                  {Number(item.amount).toFixed(2)} m³
                </p>
                <p className="bg-gray-950 rounded-sm px-2 py-1 text-[8px] text-gray-400">
                  {dayjs(item.time * 1000).format("dddd, DD-MMMM-YYYY HH.mm")} •{" "}
                  {dayjs(item.time * 1000).fromNow()}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardList;
