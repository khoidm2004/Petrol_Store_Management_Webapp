import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { create } from "zustand";
import { firestore } from "../firebase/firebase.js";

const useStaffStore = create((set) => ({
  // Map data from array
  staff: [],

  fetchStaff: async () => {
    const staffCollection = collection(firestore, "staff");
    const staffSnapshot = await getDocs(staffCollection);
    const staffList = staffSnapshot.docs.map((doc) => ({
      staffId: doc.id,
      ...doc.data(),
    }));

    set({ staff: staffList });
  },

  /* 
  const newStaff = {
    staffId: string
    fullName: string
    phoneNum: string
    email: string (cannot be modified)
    workingStatus: string
  }
  */

  addStaff: async (newStaff, showToast) => {
    try {
      const staffRef = collection(firestore, "staff");
      const q = query(staffRef, where("email", "==", newStaff.email));
      const staffQuerySnapshot = await getDocs(q);

      if (!staffQuerySnapshot.empty) {
        showToast("Error", "Email has been registered", "error");
        return;
      }

      const docRef = await addDoc(staffRef, newStaff);
      set((state) => ({
        staff: [...state.staff, { id: docRef.id, ...newStaff }],
      }));
      prompt("Thành công");
      // showToast("Success", "Staff has been added successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  },

  // Modify everything except id
  modifyStaff: async (inputs, showToast) => {
    try {
      const { staffId, ...updatedStaff } = inputs;
      const staffDocRef = doc(firestore, "staff", staffId);
      await updateDoc(staffDocRef, updatedStaff);

      set((state) => ({
        staff: state.staff.map((member) =>
          member.staffId === staffId ? { ...member, ...updatedStaff } : member
        ),
      }));
      alert("Thành công");
      showToast("Success", "Staff has been updated successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  },
}));

export default useStaffStore;
