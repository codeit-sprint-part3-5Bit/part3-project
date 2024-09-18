export const elapsedTimeConverter = (createdAt: string) => {
  const createdTimeObject = new Date(createdAt);
  const createdTimeUTC = createdTimeObject.getTime();

  const timeDifference = Date.now() - createdTimeUTC;

  const seconds = Math.floor(timeDifference / 1000);
  if (seconds < 60) return "방금전";

  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)}분전`;

  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}시간전`;

  const days = hours / 24;
  if (days < 7) return `${Math.floor(days)}일전`;

  const weeks = days / 7;
  if (weeks < 52) return `${Math.floor(weeks)}주전`;

  const years = weeks / 52;
  if (years < 10) return `${Math.floor(years)}년전`;

  return `${createdTimeObject.toLocaleDateString()}`;
};
