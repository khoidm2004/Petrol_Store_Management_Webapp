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
        pumpId: number
        pumpCode: string
        pumpName: string
        product: object {productCode:number,productName:string}
        tank: object{tankName:string, tankCode:string}
        pumpStatus: string
    }
*/

  addPump: async (showToast, newPump) => {
    try {
      const pumpRef = collection(firestore, "pump");

      //Checking pumpCode validity
      const qCode = query(pumpRef, where("pumpCode", "==", newPump.pumpCode));
      const pumpCodeQuerySnapshot = await getDocs(qCode);
      if (!pumpCodeQuerySnapshot.empty) {
        showToast("Error", "Pump code has been used", "error");
        return;
      }

      //Checking pumpId validity
      const qId = query(pumpRef, where("pumpId", "==", newPump.pumpId));
      const pumpIdQuerySnapshot = await getDocs(qId);
      if (!pumpIdQuerySnapshot.empty) {
        showToast("Error", "Pump Id has been used", "error");
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
    try {
      const { pumpId, ...updatedPump } = inputs;
      const pumpDocRef = doc(firestore, "pump", pumpId);
      await updateDoc(pumpDocRef, updatedPump);

      set((state) => ({
        pumps: state.pumps.map((pump) =>
          pump.pumpId === pumpId ? { ...pump, updatedPump } : pump
        ),
      }));
      showToast("Success", "Pump has been added successfully", "error");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  },
}));

export default usePumpStore;
