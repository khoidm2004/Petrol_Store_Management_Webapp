import { auth } from "../firebase/firebase";
import { useUpdatePassword } from "react-firebase-hooks/auth";

const useChangePassword = async (newPassword) => {
  const [updatePassword, updating, error] = useUpdatePassword(auth);
  console.log(newPassword)
  try {
    const success = await updatePassword(newPassword);
    if (success) {
      return { updating };
    }
  } catch (error) {
    return { Title: "Error", Message: error.message, Status: "error" };
  }
};

export default useChangePassword;
