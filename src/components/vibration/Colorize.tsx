// @ts-nocheck
export default function Colorize({ value, alarm, danger }) {
  let val = value;
  let alm = alarm;
  let dan = danger;

  if (val >= dan) {
    return (
      <span className="p-1 font-semibold bg-red-1 text-red-800 rounded-md m-1 flex w-12 text-center justify-around text-sm">
        {value}
      </span>
    );
  }
  if (val < dan && val >= alm) {
    return (
      <span className="p-1 font-semibold bg-orange-1 text-red-400 rounded-md m-1 flex w-12 text-center justify-around text-sm">
        {value}
      </span>
    );
  } else
    return (
      <span className="p-1 font-semibold bg-lime-3 text-green-600 rounded-md m-1 flex w-12 text-center justify-around text-sm">
        {value}
      </span>
    );
}
