import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const useReclaimPassword = async (email) => {
  const auth = getAuth();

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
      Title: "Error",
      Message: `Error Code:${errorCode} (${errorMessage})`,
      Status: "error",
    };
  }
};

export default useReclaimPassword;
