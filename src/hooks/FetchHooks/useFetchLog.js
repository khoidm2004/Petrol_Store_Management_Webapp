import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const useFetchLog = async (limitAmount) => {
  try {
    const logCollection = collection(firestore, "log");
    const qLog = query(
      logCollection,
      orderBy("startTime", "desc"),
      limit(limitAmount)
    );
    const logSnapshot = await getDocs(qLog);
    const logList = logSnapshot.docs.map((doc) => ({
      logId: doc.id,
      ...doc.data(),
    }));
    return logList;
  } catch (error) {
    return { Title: "Error", Message: error.message, Status: "error" };
  }
};

export default useFetchLog;
