import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const useFetchRevenue = async (limitAmount) => {
  try {
    const revenueRef = collection(firestore, "revenue");
    const qRevenue = query(
      revenueRef,
      orderBy("date", "desc"),
      limit(limitAmount)
    );
    const revenueSnapshot = await getDocs(qRevenue);
    const revenueList = revenueSnapshot.docs.map((doc) => ({
      rid: doc.rid,
      ...doc.data(),
    }));
    return revenueList;
  } catch (error) {
    return { Title: "Error", Message: error.message, Status: "error" };
  }
};

export default useFetchRevenue;
