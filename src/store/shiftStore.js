import {
  getDoc,
  collection,
  getDocs,
  updateDoc,
  setDoc,
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
    shiftId: string
    startTime: number
    endTime: number
    pumpList: object{pumpName:string, pumpCode:string, firstMeterReadingByMoney:number, firstMeterReadingByLitre:number}
    employeeList: array[]
    productList: object{productName, productCode, productPrice}
  }
  */

  addShift: async (newShift) => {
    try {
      const counterRef = doc(firestore, "counter", "shiftCounter");
      const counterDoc = await getDoc(counterRef);

      let currentCount = counterDoc.data().count;

      currentCount += 1;
      await updateDoc(counterRef, { count: currentCount });

      const shiftId = currentCount.toString();
      const shiftRef = doc(firestore, "shift", shiftId);

      await setDoc(shiftRef, { ...newShift, shiftId });

      set((state) => ({
        shifts: [...state.shifts, { ...newShift, shiftId }],
      }));

      return {
        Title: "Thông báo",
        Message: "Thêm thành công",
        Status: "success",
      };
    } catch (error) {
      return {
        Title: "Lỗi",
        Message: error.message,
        Status: "error",
      };
    }
  },

  modifyShift: async (inputs) => {
    try {
      const { shiftId, ...updatedShift } = inputs;
      const shiftRef = doc(firestore, "shift", shiftId);
      await updateDoc(shiftRef, updatedShift);

      set((state) => ({
        shifts: state.shifts.map((shift) =>
          shift.shiftId === shiftId ? { ...shift, ...updatedShift } : shift
        ),
      }));

      return {
        Title: "Thành công",
        Message: "Chỉnh sửa thành công",
        Status: "success",
      };
    } catch (error) {
      return {
        Title: "Lỗi",
        Message: error.message,
        Status: "error",
      };
    }
  },
}));

export default useShiftStore;
