import { create } from "zustand";
import { parseUserInfoFromStorage } from "../utils/userInfoStorage.js";

// #region agent log
(() => {
  const raw = localStorage.getItem("user-info");
  fetch("http://127.0.0.1:7392/ingest/3a2acc06-7c4b-45fe-852c-7f04152d1d80", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "d39e18",
    },
    body: JSON.stringify({
      sessionId: "d39e18",
      location: "authStore.js:init",
      message: "user-info raw before parseUserInfoFromStorage",
      data: {
        typeofRaw: typeof raw,
        isNull: raw === null,
        len: typeof raw === "string" ? raw.length : -1,
        isLiteralStringUndefined: raw === "undefined",
        hypothesisId: "H1",
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
})();
// #endregion

const useAuthStore = create((set) => ({
  user: parseUserInfoFromStorage(),
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  setUser: (user) => set({ user }),
}));

export default useAuthStore;
