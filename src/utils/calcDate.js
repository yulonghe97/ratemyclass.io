exports.timeDiffCalc = (dateFuture, dateNow) => {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
  let difference = { days: "", hours: "", minutes: "" };

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  if (days > 0) {
    difference.days = days === 1 ? `${days} day` : `${days} days`;
  }

  if (hours !== 0) {
    difference.hours = hours === 1 ? `${hours} hour` : `${hours} hours`;
  }

  if (minutes !== 0) {
    difference.minutes =
      minutes === 1 ? `${minutes} minute` : `${minutes} minutes`;
  }

  return difference;
}

exports.dateToString = (date) => {
    if (date.days !== '') {
      return `${date.days}`;
    }
    if (date.hours !== '') {
      return `${date.hours}`;
    }
    if (date.minutes !== '') {
      return `${date.minutes}`;
    }
  };
  
  