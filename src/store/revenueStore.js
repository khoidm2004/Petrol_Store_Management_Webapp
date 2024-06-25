import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useFetchRevenue = async () => {
  try {
    const logCollection = collection(firestore, "revenue");
    const logSnapshot = await getDocs(logCollection);
    const revenueList = logSnapshot.docs.map((doc) => ({
        rid: doc.rid,
      ...doc.data(),
    }));
    return { revenueList };
  } catch (error) {
    return { Title: "Error", Message: error.message, Status: "error" };
  }
};

export default useFetchRevenue;