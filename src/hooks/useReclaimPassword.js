import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";

const useReclaimPassword = async (email) => {
  try {
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
