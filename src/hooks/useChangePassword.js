import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";

<<<<<<< HEAD
const useChangePassword = async (newPassword, email, currentPassword, uid) => {
=======
const useChangePassword = async (newPassword, email, currentPassword) => {
  console.log(newPassword, email, currentPassword);
>>>>>>> afe1d7a459e386db7a3cde3660b7b19aef2ecba4
  const user = auth.currentUser;
  if (!user) {
    return { Title: "Error", Message: "No user is signed in", Status: "error" };
  }

  try {
    const credential = EmailAuthProvider.credential(email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, newPassword);

    const userRef = doc(firestore, "user", uid);
    await updateDoc(userRef, { pass: newPassword });

    return {
      Title: "Success",
      Message: "Password updated successfully",
      Status: "success",
    };
  } catch (error) {
    return { Title: "Error", Message: error.message, Status: "error" };
  }
};

export default useChangePassword;
