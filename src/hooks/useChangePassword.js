import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";

const useChangePassword = async (newPassword, email, currentPassword) => {
  console.log(newPassword, email, currentPassword);
  const user = auth.currentUser;
  if (!user) {
    return { Title: "Error", Message: "No user is signed in", Status: "error" };
  }

  try {
    const credential = EmailAuthProvider.credential(email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, newPassword);
    const userRef = doc(firestore, "user", user.uid);
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
