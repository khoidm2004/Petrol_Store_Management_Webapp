export const timeAgo = (timestamp) => {
  const now = Date.now();
  const timeAgo = Math.floor((now - timestamp) / 1000);

  if (timeAgo < 3600) {
    const minutesAgo = Math.floor(timeAgo / 60);
    return `${minutesAgo}m`;
  } else {
    const hourAgo = Math.floor(timeAgo / 3600);
    return `${hourAgo}h`;
  }
};
