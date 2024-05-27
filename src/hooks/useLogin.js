import { doc, getDoc } from "@firebase/firestore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useSignInWithEmailAndPassword from "react-firebase-hooks";
import { firestore } from "../firebase/firebase";

const useLogin = () => {
  const showToast = useShowToast();
  const [signInWithEmailAndPassword, loading, error] =
    useSignInWithEmailAndPassword();
  const loginUser = useAuthStore((state) => state.login);

  const login = async (inputs) => {
    if (!inputs.email || !inputs.password) {
      showToast("Warning", "Please fill all the fields", "warning");
    }
    try {
      const userCred = await signInWithEmailAndPassword(
        inputs.email,
        inputs.password
      );

      if (userCred) {
        const docRef = doc(firestore, "users", userCred.user.uid);
        const docSnap = await getDoc(docRef);
        localStorage.setItem("user-info", JSON.stringify(docSnap.data()));
        loginUser(docSnap.data());
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };
  return { login, loading, error };
};

export default useLogin;
