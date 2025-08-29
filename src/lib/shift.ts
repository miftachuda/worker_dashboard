import * as luxon from "luxon";
const firstDate = new Date("2020-08-05T00:00:01");
const listshift = [
  ["A1 Malam", "B2 Pagi", "C3 Sore", "D Off Malam"],
  ["A2 Malam", "B3 Pagi", "D1 Sore", "C Off Sore"],
  ["A3 Malam", "C1 Pagi", "D2 Sore", "B Off Pagi"],
  ["B1 Malam", "C2 Pagi", "D3 Sore", "A Off Malam"],
  ["B2 Malam", "C3 Pagi", "A1 Sore", "D Off Sore"],
  ["B3 Malam", "D1 Pagi", "A2 Sore", "C Off Pagi"],
  ["C1 Malam", "D2 Pagi", "A3 Sore", "B Off Malam"],
  ["C2 Malam", "D3 Pagi", "B1 Sore", "A Off Sore"],
  ["C3 Malam", "A1 Pagi", "B2 Sore", "D Off Pagi"],
  ["D1 Malam", "A2 Pagi", "B3 Sore", "C Off Malam"],
  ["D2 Malam", "A3 Pagi", "C1 Sore", "B Off Sore"],
  ["D3 Malam", "B1 Pagi", "C2 Sore", "A Off Pagi"],
];

const listshift2 = [
  ["A1 Malam", "B2 Pagi", "C3 Sore", "D Off Malam"],
  ["A2 Malam", "B3 Pagi", "C Off Sore", "D1 Sore"],
  ["A3 Malam", "B Off Pagi", "C1 Pagi", "D2 Sore"],
  ["A Off Malam", "B1 Malam", "C2 Pagi", "D3 Sore"],
  ["A1 Sore", "B2 Malam", "C3 Pagi", "D Off Sore"],
  ["A2 Sore", "B3 Malam", "C Off Pagi", "D1 Pagi"],
  ["A3 Sore", "B Off Malam", "C1 Malam", "D2 Pagi"],
  ["A Off Sore", "B1 Sore", "C2 Malam", "D3 Pagi"],
  ["A1 Pagi", "B2 Sore", "C3 Malam", "D Off Pagi"],
  ["A2 Pagi", "B3 Sore", "C Off Malam", "D1 Malam"],
  ["A3 pagi", "B Off Sore", "C1 Sore", "D2 Malam"],
  ["A Off pagi", "B1 Pagi", "C2 Sore", "D3 Malam"],
];
function getPeriod(min: number) {
  if (min < 480) {
    return 0;
  }
  if (min < 960) {
    return 1;
  } else {
    return 2;
  }
}
function getShiftList(date: Date) {
  const diffTime = Math.abs(date.getTime() - firstDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const index = diffDays % listshift.length;
  return listshift[index];
}
function getShiftList2(date: Date) {
  const diffTime = Math.abs(date.getTime() - firstDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return listshift2[diffDays % listshift.length];
}
function shiftNow() {
  const now = luxon.DateTime.now().setZone("Asia/jakarta");
  const end = luxon.DateTime.fromISO("2021-12-22", { zone: "Asia/Jakarta" });
  const diff = now.diff(end, ["days", "minutes"]);
  const day = Math.trunc(diff.days) % 12;
  const minutes = Math.trunc(diff.minutes) % 1440;
  return listshift[day][getPeriod(minutes)];
}
function fullShift(input: string) {
  if (typeof input == "string") {
    let shift = input.toUpperCase();
    if (shift == "N") {
      if (luxon.DateTime.now().weekday >= 6) {
        return "H Libur";
      } else {
        return "H Harian";
      }
    } else if (shift == "A" || shift == "B" || shift == "C" || shift == "D") {
      const now = luxon.DateTime.now().setZone("Asia/jakarta");
      const end = luxon.DateTime.fromISO("2021-12-22", {
        zone: "Asia/Jakarta",
      });
      const diff = now.diff(end, ["days", "minutes"]);
      const day = Math.trunc(diff.days) % 12;
      var today_list = listshift[day];
      return today_list.filter((x) => {
        return x.charAt(0) == shift;
      })[0];
    } else {
      return `${input} Not Found`;
    }
  } else {
    return `${input} Not Found`;
  }
}

export { getShiftList, getShiftList2, shiftNow, fullShift };
