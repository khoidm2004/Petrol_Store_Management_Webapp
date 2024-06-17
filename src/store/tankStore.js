import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
} from "firebase/firestore";
import { create } from "zustand";
import { firestore } from "../firebase/firebase.js";

const useTankStore = create((set) => ({
  // Map data from array
  tanks: [],

  fetchTank: async () => {
    const tankRef = collection(firestore, "tank");
    const tankSnapShot = await getDocs(tankRef);
    const tankList = tankSnapShot.docs.map((doc) => ({
      tid: doc.id,
      ...doc.data(),
    }));
    set({ tanks: tankList });
  },

  /* 
  const newTank = {
    tid: string
    tankId: number
    tankCode: string
    tankName: string
    tankVolume: number
    product: object{productName:string, productCode:number}
    tankStatus: string
  }
*/

  addTank: async (newTank) => {
    try {
      const tankRef = collection(firestore, "tank");

      //Checking tankId validity
      const qId = query(tankRef, where("tankId", "==", newTank.tankId));
      const tankIdQuerySnapshot = await getDocs(qId);
      if (!tankIdQuerySnapshot.empty) {
        return {
          Title: "Error",
          Message: "Tank Id has been used",
          Status: "error",
        };
      }

      //Checking tankCode validity
      const qCode = query(tankRef, where("tankCode", "==", newTank.tankCode));
      const tankCodeQuerySnapshot = await getDocs(qCode);
      if (!tankCodeQuerySnapshot.empty) {
        return {
          Title: "Error",
          Message: "Tank Code has been used",
          Status: "error",
        };
      }

      const docRef = await addDoc(tankRef, newTank);

      const tid = docRef.id;
      await updateDoc(doc(firestore, "tank", tid), { tid });

      set((state) => ({
        tanks: [...state.tanks, { id: tid, ...newTank, tid }],
      }));
      return {
        Title: "Success",
        Message: "Adding Successfully",
        Status: "success",
      };
    } catch (error) {
      return {
        Title: "Error",
        Message: error.message,
        Status: "error",
      };
    }
  },

  //Able to modify everything except id
  modifyTank: async (inputs) => {
    try {
      const { tid, ...updatedTank } = inputs;
      const tankDocRef = doc(firestore, "tank", tid);
      await updateDoc(tankDocRef, updatedTank);

      set((state) => ({
        tanks: state.tanks.map((tank) =>
          tank.tid === tid ? { ...tank, ...updatedTank } : tank
        ),
      }));
      return {
        Title: "Success",
        Message: "Modifying Successfully",
        Status: "success",
      };
    } catch (error) {
      return {
        Title: "Error",
        Message: error.message,
        Status: "error",
      };
    }
  },

  // Search using tank id || code || name
  searchTank: async (inputs) => {
    try {
      const tankRef = collection(firestore, "tank");
      const qId = query(tankRef, where("tankId", "==", parseInt(inputs))); // Automatically convert to number
      const qCode = query(tankRef, where("tankCode", "==", inputs));
      const qName = query(tankRef, where("tankName", "==", inputs));

      const tankIdQuerySnapshot = await getDocs(qId);
      const tankCodeQuerySnapshot = await getDocs(qCode);
      const tankNameQuerySnapshot = await getDocs(qName);

      if (
        tankIdQuerySnapshot.empty &&
        tankCodeQuerySnapshot.empty &&
        tankNameQuerySnapshot.empty
      ) {
        return { Title: "Error", Message: "Tank Not Found", Status: "error" };
      }

      if (!tankIdQuerySnapshot.empty) {
        const tankList1 = tankIdQuerySnapshot.docs.map((doc) => ({
          tid: doc.id,
          ...doc.data(),
        }));

        set({ tanks: tankList1 });
      }

      if (!tankCodeQuerySnapshot.empty) {
        const tankList2 = tankCodeQuerySnapshot.docs.map((doc) => ({
          tid: doc.id,
          ...doc.data(),
        }));

        set({ tanks: tankList2 });
      }

      if (!tankNameQuerySnapshot.empty) {
        const tankList3 = tankNameQuerySnapshot.docs.map((doc) => ({
          tid: doc.id,
          ...doc.data(),
        }));

        set({ tanks: tankList3 });
      }
    } catch (error) {
      return { Title: "Error", Message: error.message, Status: "error" };
    }
  },
}));

export default useTankStore;
