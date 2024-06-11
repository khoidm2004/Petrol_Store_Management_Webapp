export const timeConverter = (timestamp) => {
  const orgTimestamp = new Date(timestamp);
  const date = orgTimestamp.toLocaleDateString();
  const time = orgTimestamp.toLocaleDateString();

  return { date, time };
};
