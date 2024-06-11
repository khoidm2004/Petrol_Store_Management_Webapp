export const timeConverter = (timestamp) => {
  if (typeof timestamp !== "number" || timestamp.toString().length !== 13) {
    return { Title: "Error", Message: "Invalid timestamp", Status: "error" };
  }
  try {
    const orgTimestamp = new Date(timestamp);
    const date = orgTimestamp.toLocaleDateString();
    const time = orgTimestamp.toLocaleTimeString();
    return { date, time };
  } catch (error) {
    return { Title: "Error", Message: error.message, Status: "error" };
  }
};
