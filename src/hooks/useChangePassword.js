import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";

const useChangePassword = async (newPassword, email, currentPassword, uid) => {
  const user = auth.currentUser;
  if (!user) {
    return { Title: "Lỗi", Message: "Người dùng chưa đăng nhập", Status: "error" };
  }

  try {
    const credential = EmailAuthProvider.credential(email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, newPassword);

    const userRef = doc(firestore, "user", uid);
    await updateDoc(userRef, { pass: newPassword });

    return {
      Title: "Thông báo",
      Message: "Cập nhật thành công",
      Status: "success",
    };
  } catch (error) {
    return { Title: "Lỗi", Message: error.message, Status: "error" };
  }
};

export default useChangePassword;
