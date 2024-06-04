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
import { Title } from "chart.js";

const useTankStore = create((set) => ({
  // Map data from array
  tanks: [],

  fetchTank: async () => {
    const tankRef = collection(firestore, "tank");
    const tankSnapShot = await getDocs(tankRef);
    const tankList = tankSnapShot.docs.map((doc) => ({
      tankId: doc.id,
      ...doc.data(),
    }));
    set({ tanks: tankList });
  },

  /* 
  const newTank = {
    id: string
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
      set((state) => ({
        tanks: [...state.tanks, { id: docRef, ...newTank }],
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
      const { id, ...updatedTank } = inputs;
      const tankDocRef = doc(firestore, "tank", id);
      await updateDoc(tankDocRef, updatedTank);

      set((state) => ({
        tanks: state.tanks.map((tank) =>
          tank.id === id ? { ...tank, ...updatedTank } : tank
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
}));

export default useTankStore;
