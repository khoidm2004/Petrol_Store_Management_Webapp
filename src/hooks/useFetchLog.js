import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useFetchLog = async () => {
  try {
    const logCollection = collection(firestore, "log");
    const logSnapshot = await getDocs(logCollection);
    const logList = logSnapshot.docs.map((doc) => ({
      logId: doc.id,
      ...doc.data(),
    }));
    return { logList };
  } catch (error) {
    return { Title: "Error", Message: error.message, Status: "error" };
  }
};

export default useFetchLog;
