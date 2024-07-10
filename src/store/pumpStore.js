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
      pid: doc.id,
      ...doc.data(),
    }));

    set({ pumps: pumpList });
  },

  /*
    const newPump = {
        pid: string
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
          Title: "Lỗi",
          Message: "Mã vòi đã được sử dụng",
          Status: "error",
        };
      }

      //Checking pumpId validity
      const qId = query(pumpRef, where("pumpId", "==", newPump.pumpId));
      const pumpIdQuerySnapshot = await getDocs(qId);
      if (!pumpIdQuerySnapshot.empty) {
        return {
          Title: "Lỗi",
          Message: "Id vòi đã được sử dụng",
          Status: "Error",
        };
      }

      const docRef = await addDoc(pumpRef, newPump);

      const pid = docRef.id;
      await updateDoc(doc(firestore, "pump", pid), { pid });

      set((state) => ({
        pumps: [...state.pumps, { id: pid, ...newPump, pid }],
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

  //Able to modify everything except pid
  modifyPump: async (inputs) => {
    try {
      const { pid, ...updatedPump } = inputs;
      const pumpDocRef = doc(firestore, "pump", pid);
      await updateDoc(pumpDocRef, updatedPump);

      set((state) => ({
        pumps: state.pumps.map((pump) =>
          pump.pid === pid ? { ...pump, ...updatedPump } : pump
        ),
      }));
      return {
        Title: "Thông báo",
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

  // Search pump using id || code || name
  searchPump: async (inputs) => {
    try {
      const pumpRef = collection(firestore, "pump");

      const qId = query(pumpRef, where("pumpId", "==", parseInt(inputs))); // Automatically convert to number
      const qCode = query(pumpRef, where("pumpCode", "==", inputs));
      const qName = query(pumpRef, where("pumpName", "==", inputs));

      const pumpIdQuerySnapshot = await getDocs(qId);
      const pumpCodeQuerySnapshot = await getDocs(qCode);
      const pumpNameQuerySnapshot = await getDocs(qName);

      if (
        pumpIdQuerySnapshot.empty &&
        pumpCodeQuerySnapshot.empty &&
        pumpNameQuerySnapshot.empty
      ) {
        return { Title: "Lỗi", Message: "Pump Not Found", Status: "error" };
      }

      if (!pumpIdQuerySnapshot.empty) {
        const pumpList1 = pumpIdQuerySnapshot.docs.map((doc) => ({
          pid: doc.id,
          ...doc.data(),
        }));

        set({ pumps: pumpList1 });
      }

      if (!pumpCodeQuerySnapshot.empty) {
        const pumpList2 = pumpCodeQuerySnapshot.docs.map((doc) => ({
          pid: doc.id,
          ...doc.data(),
        }));

        set({ pumps: pumpList2 });
      }

      if (!pumpNameQuerySnapshot.empty) {
        const pumpList3 = pumpNameQuerySnapshot.docs.map((doc) => ({
          pid: doc.id,
          ...doc.data(),
        }));

        set({ pumps: pumpList3 });
      }
    } catch (error) {
      return { Title: "Lỗi", Message: error.message, Status: "error" };
    }
  },
}));

export default usePumpStore;
