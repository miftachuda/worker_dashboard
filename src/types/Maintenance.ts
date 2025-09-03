type recordx = {
  shift: string;
  period: string;
  photos: string[];
  description: string[];
  last_edited: string;
};
export type Maintenancex = {
  id: number;
  created_at: string;
  name: string;
  record: {
    record: recordx[]; // nested record
  };
  last_edited: string;
};
