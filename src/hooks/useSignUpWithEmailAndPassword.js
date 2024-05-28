//For true admin
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import useShowToast from "./useShowToast.js";
import useAuthStore from "../store/authStore.js";
import {
  collection,
  doc,
  getDoc,
  query,
  setDoc,
  where,
} from "@firebase/firestore";
import { auth, firestore } from "../firebase/firebase";

const useSignUpWithEmailAndPassword = () => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const showToast = useShowToast();
  const loginUser = useAuthStore();

  const signup = async (inputs) => {
    if (!inputs.fullName || !inputs.phoneNum || !inputs.email || !inputs.pass) {
      showToast("Warning", "Please fill all the fields", "warning");
    }

    const userRef = collection(firestore, "users");

    const q = query(userRef, where("email", "==", inputs.email));
    const querySnapshot = await getDoc(q);

    if (!querySnapshot.empty) {
      showToast("Error", "Email has been registered", "error");
      return;
    }

    try {
      const newUser = await createUserWithEmailAndPassword(
        inputs.email,
        inputs.password
      );

      if (!newUser && error) {
        showToast("Error", error.message, "error");
        return;
      }

      if (newUser) {
        const userDoc = {
          uid: newUser.user.uid,
          fullName: inputs.fullName,
          email: inputs.email,
          phoneNum: inputs.phoneNum,
          password: inputs.password,
          avatar: "",
          storeName: "",
        };
        await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
        localStorage.setItem("user-info", JSON.stringify(userDoc));
        loginUser(userDoc);
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return { signup, user, loading, error };
};

export default useSignUpWithEmailAndPassword;
