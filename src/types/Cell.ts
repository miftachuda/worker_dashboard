type RowData = {
  id: number;
  name: string;
  PRL: number;
} & {
  [K in `day_${
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31}`]: string;
};

export type Cell = {
  name: string;
  shift: string;
  day: number;
  month: number;
  year: number;
  rowData: RowData;
};
