import { addDoc, collection, getDocs } from "firebase/firestore";
import { create } from "zustand";
import { firestore } from "../firebase/firebase.js";

const useShiftStore = create((set) => ({
  // Map data from array
  shifts: [],

  fetchShift: async () => {
    const shiftRef = collection(firestore, "shift");
    const shiftSnapshot = await getDocs(shiftRef);
    const shiftList = shiftSnapshot.docs.map((doc) => ({
      id: doc.id,
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

  addShift: async (newShift, showToast) => {
    try {
      const shiftRef = collection(firestore, "shift");
      const docRef = await addDoc(shiftRef, newShift);
      set((state) => ({
        shifts: [...state.shifts, { id: docRef, ...newShift }],
      }));
      showToast("Success", "Shift has been added successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
      return;
    }
  },
}));

export default useShiftStore;
