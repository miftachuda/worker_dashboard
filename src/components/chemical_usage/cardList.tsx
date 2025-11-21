import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.locale("id");
const CardList = ({ data }: { data: any }) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  );

  return (
    <div className="w-full mt-2 flex flex-col gap-3">
      {sortedData.map((item, index) => (
        <div
          key={index}
          className="w-full bg-gray-900 rounded-lg shadow-md p-4 border"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">Make Up</p>
              <p className="text-sm text-gray-500">{item.chemical_name}</p>
              <p className=" bg-gray-950 rounded-sm px-2 py-1 text-sm text-gray-400">
                {item.description}{" "}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-xl font-bold text-blue-600">
                {Number(item.amount).toFixed(2)} m³
              </p>
              <p className=" bg-gray-950 rounded-sm px-2 py-1 text-[8px] text-gray-400">
                {dayjs(item.created).format("dddd, DD-MMMM-YYYY HH.mm")} •{" "}
                {dayjs(item.created).fromNow()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardList;
