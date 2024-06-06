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
        id: string
        pumpId: number
        pumpCode: string
        pumpName: string
        product: object {productCode:number,productName:string}
        tank: object{tankName:string, tankCode:string}
        pumpStatus: string
    }
*/

  addPump: async (newPump) => {
    try {
      const pumpRef = collection(firestore, "pump");

      //Checking pumpCode validity
      const qCode = query(pumpRef, where("pumpCode", "==", newPump.pumpCode));
      const pumpCodeQuerySnapshot = await getDocs(qCode);
      if (!pumpCodeQuerySnapshot.empty) {
        return {
          Title: "Error",
          Message: "Pump Code has been used",
          Status: "error",
        };
      }

      //Checking pumpId validity
      const qId = query(pumpRef, where("pumpId", "==", newPump.pumpId));
      const pumpIdQuerySnapshot = await getDocs(qId);
      if (!pumpIdQuerySnapshot.empty) {
        return {
          Title: "Error",
          Message: "Pump Id has been used",
          Status: "Error",
        };
      }

      const docRef = await addDoc(pumpRef, newPump);

      const id = docRef.id;
      await updateDoc(doc(firestore, "pump", id), { id });

      set((state) => ({
        pumps: [...state.pumps, { id: id, ...newPump, id }],
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
  modifyPump: async (inputs) => {
    try {
      const { id, ...updatedPump } = inputs;
      const pumpDocRef = doc(firestore, "pump", id);
      await updateDoc(pumpDocRef, updatedPump);

      set((state) => ({
        pumps: state.pumps.map((pump) =>
          pump.id === id ? { ...pump, updatedPump } : pump
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

export default usePumpStore;
