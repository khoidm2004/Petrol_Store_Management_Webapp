//For true admin
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
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
  const loginUser = useAuthStore();

  const signup = async (inputs) => {
    const userRef = collection(firestore, "users");

    const q = query(userRef, where("email", "==", inputs.email));
    const querySnapshot = await getDoc(q);

    if (!querySnapshot.empty) {
      return {
        Title: "Error",
        Message: "Email has been registered",
        Status: "error",
      };
    }

    try {
      const newUser = await createUserWithEmailAndPassword(
        inputs.email,
        inputs.password
      );

      if (!newUser && error) {
        return {
          Title: "Error",
          Message: error.message,
          Status: "error",
        };
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
      return {
        Title: "Error",
        Message: error.message,
        Status: "error",
      };
    }
  };

  return { signup, user, loading, error };
};

export default useSignUpWithEmailAndPassword;
