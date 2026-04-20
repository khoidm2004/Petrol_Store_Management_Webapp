/** Safe read of persisted user profile; avoids JSON.parse on null / literal "undefined". */
export function parseUserInfoFromStorage() {
  const raw = localStorage.getItem("user-info");
  if (raw == null || raw === "" || raw === "undefined") {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
