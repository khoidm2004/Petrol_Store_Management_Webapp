import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { create } from "zustand";
import { firestore } from "../firebase/firebase.js";

const useShiftStore = create((set) => ({
  // Map data from array
  shifts: [],

  fetchShift: async () => {
    const shiftRef = collection(firestore, "shift");
    const shiftSnapshot = await getDocs(shiftRef);
    const shiftList = shiftSnapshot.docs.map((doc) => ({
      shiftId: doc.id,
      ...doc.data(),
    }));

    set({ shifts: shiftList });
  },

  /*
  const newShift = {
    startTime: number
    endTime: number
    pumpList: object{pumpName:string, pumpCode:string, firstMeterReadingByMoney:number, firstMeterReadingByLitre:number}
    employeeList: array[]
    productList: object{productName, productCode, productPrice}
  }
  */

  addShift: async (newShift) => {
    try {
      const shiftRef = collection(firestore, "shift");
      const docRef = await addDoc(shiftRef, newShift);

      const shiftId = docRef.id;
      await updateDoc(doc(firestore, "shift", shiftId), { shiftId });

      set((state) => ({
        shifts: [...state.shifts, { id: shiftId, ...newShift, shiftId }],
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

  modifyShift: async (inputs) => {
    try {
      const { shiftId, ...updatedShift } = inputs;
      const shiftRef = collection(firestore, "shift", shiftId);
      await updateDoc(shiftRef, updatedShift);

      set((state) => ({
        shifts: state.shifts.map((shift) =>
          shift.shiftId === shiftId ? { ...shift, ...updatedShift } : shift
        ),
      }));

      return {
        Title: "Success",
        Description: "Modifying Successfully",
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

export default useShiftStore;
