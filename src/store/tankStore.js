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
import { firestore } from "../firebase/firebase";

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
    tankId: string,
    tankCode: string
    name: string
    volume: number
    product: object{name:string, productId:string}
    status: string
  }
*/

  addTank: async (newTank, showToast) => {
    try {
      const tankRef = collection(firestore, "tank");
      const q = query(tankRef, where("tank_code", "==", newTank.tank_code));
      const tankQuerySnapshot = await getDocs(q);

      if (!tankQuerySnapshot.empty) {
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
    const { tank_id, ...updatedTank } = inputs;
    const tankDocRef = doc(firestore, "tank", tank_id);

    try {
      await updateDoc(tankDocRef, updatedTank);

      set((state) => ({
        tanks: state.tanks.map((tank) =>
          tank.tank_id === tank_id ? { ...tank, ...updatedTank } : tank
        ),
      }));
      showToast("Success", "Tank has been updated successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  },
}));

export default useTankStore;
