const currentDate = dayjs().format(`dddd D, YYYY`);

const buttons = $('.saveBtn')

// This was moved to the global scope in order to provide the object to muiltiple functions.
const timeBlocks = $('.hour')

$(document).ready(function(){

  // The jQuery text method is needed to set the innerText property of the element.
  $('#currentDay').text(currentDate);
  
  // This dipslays the current time updated every second.  The seconds can be removed and the interval changed to a longer duration if seconds are not displayed.
  const currentTime = () => {
    let time = dayjs().format(`h:mm:ss a`)
    $('#currentTime').text(time)
  }

  setInterval(currentTime, 1000);

  setColors();

  getData();
})

buttons.on('click', function(e) {
  // console.log('clicked', e.target);
  // console.log(e.target.parentElement.children[1].innerText);
  console.log(e.target.parentElement.id);
  const parentId = e.target.parentElement.id
  
  let calendarInput = $(`#${parentId} textarea`).val().trim();
  console.log(calendarInput);

  storeData(parentId, calendarInput);
})

// This function saves data in local storage and accepts two arguments.  The function is called in the event listener when a save button is clicked and the parentId and calendarInput variables are passed to it as arguments.
const storeData = (id, input) => {
  localStorage.setItem(id, input)
}

// This getData function will retrieve the values from local storage.  It is called in the document.ready function, allowing data to persist after refresh.  All values are stored using the element's hour id as the key for easy identification.  This is the same technique used in the storeData function.
const getData = () => {
  for (let i = 0; i < timeBlocks.length; i++) {
    let timeBlockId = timeBlocks[i].parentElement.id
    let getStorage = localStorage.getItem(timeBlockId)
    $(`#${timeBlockId} textarea`).val(getStorage)
    // console.log(localStorage.getItem(timeBlockId))
  }
  
}

// This function is called within the setColors function and the return value is saved to the hourNow variable.
setHour = () => {
  let currentTime = parseInt(dayjs().format(`HH`));
  let amPm = dayjs().format(`a`)
  
  // This will evaluate false for all times after the 5pm time block and force the correct color.  The first else will return a value of 12 or below during morning hours.
  if(amPm !== 'am' && currentTime >= 18) {
    return currentTime;
  
  // While debugging issues with the 12:00 hour I found an or statement was needed here since 12PM would use the last conditional to return a value -= 12 resulting in 0.
  } else if (amPm === 'am' || currentTime == 12) {
   return currentTime;
  } else {
    return currentTime -= 12;
  }

}

// This function is called within the document.ready function.
const setColors = () => {
  // This variable was moved to the global scope as other functions required it.
  // const timeBlocks = $('.hour')
  const amPm = dayjs().format(`a`)

  let hourNow = setHour();
  
  for (let i = 0; i < timeBlocks.length; i++) {
    // console.dir(timeBlocks[i]);
    let timeInt = parseInt(timeBlocks[i].innerHTML);
    // console.log(timeInt)
    
    if (timeInt > hourNow && amPm === 'am') {

        timeBlocks[i].nextSibling.nextElementSibling.className += ' future'
      
    } else if (timeInt > hourNow && amPm === 'pm') {

      // This addtional statement was required to fix a bug where the morning hours would always evaluate to future because the numerical values compared with the curernt time were greater.
        if (timeBlocks[i].className.includes('morning')) {
          timeBlocks[i].nextSibling.nextElementSibling.className += ' past'
        } else {
          timeBlocks[i].nextSibling.nextElementSibling.className += ' future'
        }
    //  Addtional statements were needed to corretly evaluate the present time during morning hours.  The application was incorrectly reading afternoon hours as present early in the morning.
    } else if (timeInt === hourNow && amPm !== 'pm' && timeInt >= 9) {
      timeBlocks[i].nextSibling.nextElementSibling.className += ' present'

    } else if (timeInt === hourNow && amPm !== 'am') {
      timeBlocks[i].nextSibling.nextElementSibling.className += ' present'
    }
    else {
      
      // This staement was needed during the noon hour to fix a bug preventing afternoon hours from being evaluated as future due to the !=='pm'.  It was placed first to make sure it evaluates as true at noon.
      if (timeBlocks[i].className.includes('afternoon') && hourNow < 18 && hourNow === 12) {
        timeBlocks[i].nextSibling.nextElementSibling.className += ' future'
      } 
      
      // An additional statement was required here to catch afternoon hours that were evaluating as false on the first conditional statement and set them to future during morning hours.
      else if (timeBlocks[i].className.includes('afternoon') && hourNow < 18 && amPm !== 'pm') {
        timeBlocks[i].nextSibling.nextElementSibling.className += ' future'
      } else {
      timeBlocks[i].nextSibling.nextElementSibling.className += ' past'
    }
  }
}
}
