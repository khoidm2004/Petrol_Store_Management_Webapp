import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const useFetchPumpRevenue = async () => {
  try {
    const pRevCollection = collection(firestore, "pumpRevenue");
    const pRevSnapshot = await getDocs(pRevCollection);
    const pRevList = pRevSnapshot.docs.map((doc) => ({
      pid: doc.id,
      ...doc.data(),
    }));
    return pRevList;
  } catch (error) {
    return { Title: "Lỗi", Message: error.message, Status: "error" };
  }
};

export default useFetchPumpRevenue;
