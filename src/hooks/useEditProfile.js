import { useState } from "react";
import useShowToast from "./useShowToast.js";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore.js";
import { firestore, storage } from "../firebase/firebase.js";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

const useEditProfile = () => {
  const showToast = useShowToast();

  const [isUpdating, setIsUpdating] = useState(false);

  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

  const editProfile = async (inputs, selectedFile) => {
    if (isUpdating || !authUser) {
      setIsUpdating(true);
    }

    const storageRef = ref(storage, `avatarPics/${authUser.uid}`);
    const userDocRef = doc(firestore, "user", authUser.uid);

    let URL = "";

    try {
      if (selectedFile) {
        await uploadString(storageRef, selectedFile, "data_url");
        URL = await getDownloadURL(ref(storage, `avatarPics/${authUser.uid}`));
      }

      const updatedUser = {
        ...authUser,
        fullName: inputs.fullName || authUser.fullName,
        storeName: inputs.storeName || authUser.storeName,
        phoneNum: inputs.phoneNum || authUser.phoneNum,
        avatar: URL || authUser.avatar,
      };

      await updateDoc(userDocRef, updatedUser);
      localStorage.setItem("user-info", JSON.stringify(updatedUser));
      setUserProfile(updatedUser);
      setAuthUser(updatedUser);
      showToast("Success", "Avatar updated successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return { editProfile, isUpdating };
};

export default useEditProfile;
