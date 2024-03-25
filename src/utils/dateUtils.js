const toDate = (dateObject) => {
    return new Date(dateObject.year, dateObject.month - 1, dateObject.day);
}

const resetTime = (date) =>{
    date.setHours(0,0,0,0);
    return date;
}

const getTimePassed = (currentDate, lastUpdateDate) =>{

    const lastUpdate = new Date(lastUpdateDate);
    const timeDiff = currentDate.getTime() - lastUpdate.getTime();

    return timeDiff;
}

const compareDates = (currentDate, lastUpdateDate) =>{
    const timeDiff = currentDate - lastUpdateDate;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysDiff;
}

const isCurrent = (dayInfo, currentDay) => {
    if( currentDay.day == dayInfo.day &&  currentDay.month == dayInfo.month  && currentDay.year == dayInfo.year){
        return true;
    }
    return false;
  }

const getCurrentDayInfo = (currentDate) => {
    const currentDayInfo = {
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
    };
    return currentDayInfo;
}

  const isSelected = (dayInfo, selectedDay) => {
    if( dayInfo.day == selectedDay.day && dayInfo.month == selectedDay.month && dayInfo.year == selectedDay.year){
        return true;
    }
    return false;
  }

export { toDate, resetTime, compareDates, getTimePassed, isSelected, isCurrent, getCurrentDayInfo };