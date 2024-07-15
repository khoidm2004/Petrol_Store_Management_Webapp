import { doc, getDoc } from "@firebase/firestore";
import useAuthStore from "../store/authStore";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";

const useLogin = () => {
  const [signInWithEmailAndPassword, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const loginUser = useAuthStore((state) => state.login);

  const login = async (inputs) => {
    try {
      const userCred = await signInWithEmailAndPassword(
        inputs.email,
        inputs.password
      );

      if (userCred) {
        const docRef = doc(firestore, "user", userCred.user.uid);
        const docSnap = await getDoc(docRef);
        localStorage.setItem("user-info", JSON.stringify(docSnap.data()));
        loginUser(docSnap.data());
        return {
          Title: "Thành công",
          Message: "Đăng nhập thành công",
          Status: "success",
        };
      } else {
        return {
          Title: "Lỗi",
          Message: "Không tìm thấy thông tin người dùng",
          Status: "error",
        };
      }
    } catch (error) {
      return { Title: "Error", Message: error.message, Status: "error" };
    }
  };
  return { login, loading, error };
};

export default useLogin;
