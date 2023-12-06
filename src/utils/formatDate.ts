export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  });
};
