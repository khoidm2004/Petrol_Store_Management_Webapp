import { sendPasswordResetEmail } from "firebase/auth";
import { auth, firestore } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const useReclaimPassword = async (email) => {
  try {
    const emailRef = collection(firestore, "user");
    const qEmail = query(emailRef, where("email", "==", email));
    const emailQuerySnapshot = await getDocs(qEmail);

    if (emailQuerySnapshot.empty) {
      return {
        Title: "Lỗi",
        Message: "Không tìm thấy email người dùng",
        Status: "error",
      };
    }

    await sendPasswordResetEmail(auth, email);
    return {
      Title: "Success",
      Message: "Password reset email sent",
      Status: "success",
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return {
      Title: "Lỗi",
      Message: `Error Code:${errorCode} (${errorMessage})`,
      Status: "error",
    };
  }
};

export default useReclaimPassword;
