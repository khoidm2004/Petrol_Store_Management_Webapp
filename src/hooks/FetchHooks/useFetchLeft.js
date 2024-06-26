import { collection, doc, getDocs, limit, query } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const useFetchLeft = async (limitAmount) => {
  try {
    const leftRef = collection(firestore, "left");
    const qLeft = query(leftRef, limit(limitAmount));
    const leftSnapshot = await getDocs(qLeft);
    const leftList = leftSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return leftList;
  } catch (error) {
    return { Title: "Error", Message: error.message, Status: "error" };
  }
};

export default useFetchLeft;
