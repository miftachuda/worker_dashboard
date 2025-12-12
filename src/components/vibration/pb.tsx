// recordService.js
import { pb } from "../../lib/pocketbase";

// Your collection name
const COLLECTION = "vibration";

// Create Record
export const addRecord = async (vibrasi) => {
  return await pb.collection(COLLECTION).create({
    name: vibrasi.name,
    note: vibrasi.note,
    vibration: [
      {
        ma: vibrasi.vibration[0].ma,
        mv1: vibrasi.vibration[0].mv1,
        mh1: vibrasi.vibration[0].mh1,
        mv2: vibrasi.vibration[0].mv2,
        mh2: vibrasi.vibration[0].mh2,
        pa: vibrasi.vibration[0].pa,
        pv1: vibrasi.vibration[0].pv1,
        ph1: vibrasi.vibration[0].ph1,
        pv2: vibrasi.vibration[0].pv2,
        ph2: vibrasi.vibration[0].ph2,
      },
    ],
  });
};

// Edit Record
export const editRecord = async (props) => {
  let vibrasi = props.data;
  return await pb.collection(COLLECTION).update(props.docid, {
    name: vibrasi.name,
    note: vibrasi.note,
    vibration: [
      {
        ma: vibrasi.vibration[0].ma,
        mv1: vibrasi.vibration[0].mv1,
        mh1: vibrasi.vibration[0].mh1,
        mv2: vibrasi.vibration[0].mv2,
        mh2: vibrasi.vibration[0].mh2,
        pa: vibrasi.vibration[0].pa,
        pv1: vibrasi.vibration[0].pv1,
        ph1: vibrasi.vibration[0].ph1,
        pv2: vibrasi.vibration[0].pv2,
        ph2: vibrasi.vibration[0].ph2,
      },
    ],
    dateedit: new Date(), // auto timestamp
  });
};

// Delete Record
export const deleteRecord = async (id) => {
  return await pb.collection(COLLECTION).delete(id);
};

// Stream / Subscribe realtime updates
export const streamData = (callback) => {
  // listen realtime changes from newest records
  return pb.collection(COLLECTION).subscribe("*", callback);
};

// Query Record By Name
export const queryData = async (que, signal) => {
  return await pb.collection(COLLECTION).getFullList({
    filter: `name ~ "${que.join('" || name ~ "')}"`,
    fetch: (url, options) => fetch(url, { ...options, signal }), // <-- inject AbortController
  });
};
export const fetchVib = async (signal) => {
  return await pb.collection(COLLECTION).getFullList({
    sort: "-created",
    fetch: (url, options) => fetch(url, { ...options, signal }), // <-- inject signal
  });
};
