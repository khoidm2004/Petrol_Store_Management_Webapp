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
      id: doc.id,
      ...doc.data(),
    }));

    set({ tanks: tankList });
  },

  /* 
  const newTank = {
    tankId: number
    tankCode: string
    tankName: string
    tankVolume: number
    product: object{productName:string, productCode:number}
    tankStatus: string
  }
*/

  addTank: async (newTank, showToast) => {
    try {
      const tankRef = collection(firestore, "tank");

      //Checking tankId validity
      const qId = query(tankRef, where("tankId", "==", newTank.tankId));
      const tankIdQuerySnapshot = await getDocs(qId);
      if (!tankIdQuerySnapshot.empty) {
        showToast("Error", "Tank Id has been used", "error");
        return;
      }

      //Checking tankCode validity
      const qCode = query(tankRef, where("tankCode", "==", newTank.tankCode));
      const tankCodeQuerySnapshot = await getDocs(qCode);
      if (!tankCodeQuerySnapshot.empty) {
        showToast("Error", "Tank code has been used", "error");
        return;
      }

      const docRef = await addDoc(tankRef, newTank);
      set((state) => ({
        tanks: [...state.tanks, { id: docRef, ...newTank }],
      }));
      showToast("Success", "Tank has been added successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
      return;
    }
  },

  //Able to modify everything except id
  modifyTank: async (inputs, showToast) => {
    try {
      const { tankId, ...updatedTank } = inputs;
      const tankDocRef = doc(firestore, "tank", tankId);
      await updateDoc(tankDocRef, updatedTank);

      set((state) => ({
        tanks: state.tanks.map((tank) =>
          tank.tankId === tankId ? { ...tank, ...updatedTank } : tank
        ),
      }));
      showToast("Success", "Tank has been updated successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  },
}));

export default useTankStore;
