import useAuthStore from "../store/authStore.js";
import { useSignOut } from "react-firebase-hooks/auth";
import useShowToast from "./useShowToast.js";
import { auth } from "../firebase/firebase.js";

const useLogout = () => {
  const [signOut, isLoggingOut, error] = useSignOut(auth);
  const logoutUser = useAuthStore((state) => state.logout);
  const showToast = useShowToast();

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem("user-info");
      logoutUser();
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };
  return { handleLogout, isLoggingOut, error };
};

export default useLogout;
