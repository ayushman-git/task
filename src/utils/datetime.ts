export const convertToReadableDueAndCreated = (userDate: Date) => {
  let message = "";
  let msDifference = new Date().valueOf() - userDate.valueOf();

  const isDateInPast = msDifference > 0;
  // Making milliseconds absolute
  msDifference = Math.abs(msDifference);

  const seconds = msDifference / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (isDateInPast) {
    if (days > 1) {
      message = Math.round(days) + " days ago";
    } else if (hours > 1) {
      message = Math.round(hours) + " hrs ago";
    } else {
      message = Math.round(minutes) + " mins ago";
    }
  } else {
    if (days > 1) {
      message = "in " + Math.round(days) + " days";
    } else if (hours > 1) {
      message = "in " + Math.round(hours) + " hrs";
    } else {
      message = "in " + Math.round(minutes) + " mins";
    }
  }

  return message;
};