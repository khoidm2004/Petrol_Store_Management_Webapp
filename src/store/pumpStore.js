import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc
} from "firebase/firestore";
import { create } from "zustand";
import { firestore } from "../firebase/firebase";

const usePumpStore = create((set) => ({
  // Map data from array
  pumps: [],

  fetchPump: async () => {
    const pumpRef = collection(firestore, "pump");
    const pumpSnapShot = await getDocs(pumpRef);
    const pumpList = pumpSnapShot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    set({ pumps: pumpList });
  },

  /*
    const newPump = {
        pumpId: string
        pumpCode: string
        name: string
        tank: object{name:string, tankCode:string}
        status: string
    }
*/

  addPump: async (showToast, newPump) => {
    try {
      const pumpRef = collection(firestore, "pump");
      const q = query(pumpRef, where("pump_code", "==", newPump.pump_code));
      const pumpQuerySnapshot = await getDocs(q);

      if (!pumpQuerySnapshot.empty) {
        showToast("Error", "Pump code has been used", "error");
        return;
      }

      const docRef = await addDoc(pumpRef, newPump);
      set((state) => ({
        pumps: [...state.pumps, { id: docRef, newPump }],
      }));
      showToast("Success", "Pump has been added successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
      return;
    }
  },

  //Able to modify everything except id
  modifyPump: async (inputs, showToast) => {
    const { pump_id, ...updatedPump } = inputs;
    const pumpDocRef = doc(firestore, "pump", pump_id);

    try {
      await updateDoc(pumpDocRef, updatedPump);

      set((state) => ({
        pumps: state.pumps.map((pump) =>
          pump.pump_id === pump_id ? { ...pump, updatedPump } : pump
        ),
      }));
      showToast("Success", "Pump has been added successfully", "error");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  },
}));

export default usePumpStore;
