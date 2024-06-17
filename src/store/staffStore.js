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

  addStaff: async (newStaff) => {
    try {
      const staffRef = collection(firestore, "staff");
      const q = query(staffRef, where("email", "==", newStaff.email));
      const staffQuerySnapshot = await getDocs(q);

      if (!staffQuerySnapshot.empty) {
        return {
          Title: "Error",
          Message: "Email has been used",
          Status: "error",
        };
      }

      const docRef = await addDoc(staffRef, newStaff);

      const staffId = docRef.id;
      await updateDoc(doc(firestore, "staff", staffId), { staffId });

      set((state) => ({
        staff: [...state.staff, { id: staffId, ...newStaff, staffId }],
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

  // Modify everything except id
  modifyStaff: async (inputs) => {
    try {
      const { staffId, ...updatedStaff } = inputs;
      const staffDocRef = doc(firestore, "staff", staffId);
      await updateDoc(staffDocRef, updatedStaff);

      set((state) => ({
        staff: state.staff.map((member) =>
          member.staffId === staffId ? { ...member, ...updatedStaff } : member
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

  // Search using email or fullname
  searchStaff: async (inputs) => {
    try {
      const staffRef = collection(firestore, "staff");
      const qEmail = query(staffRef, where("email", "==", inputs));
      const qFullName = query(staffRef, where("fullName", "==", inputs));
      
      const staffEmailQuerySnapshot = await getDocs(qEmail);
      const staffFullNameQuerySnapshot = await getDocs(qFullName);

      if (staffEmailQuerySnapshot.empty && staffFullNameQuerySnapshot.empty) {
        return { Title: "Error", Message: "Staff Not Found", Status: "error" };
      }

      if (!staffEmailQuerySnapshot.empty) {
        const staffList1 = staffEmailQuerySnapshot.docs.map((doc) => ({
          staffId: doc.id,
          ...doc.data(),
        }));

        set({ staff: staffList1 });
      }

      if (!staffFullNameQuerySnapshot.empty) {
        const staffList2 = staffEmailQuerySnapshot.docs.map((doc) => ({
          staffId: doc.id,
          ...doc.data(),
        }));

        set({ staff: staffList2 });
      }
    } catch (error) {
      return { Title: "Error", Message: error.message, Status: "error" };
    }
  },
}));

export default useStaffStore;
