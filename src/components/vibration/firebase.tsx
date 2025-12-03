// @ts-nocheck
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limitToLast,
  serverTimestamp,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2i2tiWHOMugv4vqizlm3aTZE5r5crNhc",
  authDomain: "vibrator-ac4c0.firebaseapp.com",
  projectId: "vibrator-ac4c0",
  storageBucket: "vibrator-ac4c0.appspot.com",
  messagingSenderId: "564896221188",
  appId: "1:564896221188:web:c87b225db7f7b01fe58d51",
};

// 1. Initialize Firebase (Store the app instance)
const app = initializeApp(firebaseConfig);

// 2. Initialize Firestore
const db = getFirestore(app);

// 3. Define the collection reference once for re-use
const recordCollectionRef = collection(db, "record");

export const addRecord = (vibrasi) => {
  // Use addDoc instead of db.collection.add
  return addDoc(recordCollectionRef, {
    created: serverTimestamp(), // Use the imported function
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

export const editRecord = (props) => {
  let vibrasi = props.data;
  console.log(vibrasi);

  // Create a reference to the specific document
  const docRef = doc(db, "record", props.docid);

  // Use setDoc with merge: true
  return setDoc(
    docRef,
    {
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
      dateedit: serverTimestamp(),
    },
    { merge: true }
  );
};

export const deleteRecord = (id) => {
  const docRef = doc(db, "record", id);
  return deleteDoc(docRef);
};

// Create a query object
export const streamData = query(
  recordCollectionRef,
  orderBy("created", "desc"),
  limitToLast(20)
);

export const queryData = (que) => {
  return query(recordCollectionRef, where("name", "in", que));
};
