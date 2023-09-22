// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.


const currentDate = dayjs().format(`dddd D, YYYY`);

const buttons = $('.saveBtn')

$(document).ready(function(){

  // The jQuery text method is needed to set the innerText property of the element.
  $('#currentDay').text(currentDate);
  
  // This dipslays the current time updated every second.  The seconds can be removed and the interval changed to a longer duration if seconds are not displayed.
  currentTime = () => {
    let time = dayjs().format(`h:mm:ss a`)
    $('#currentTime').text(time)
  }
  setInterval(currentTime, 1000)

  setColors();
})

$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
});

buttons.on('click', function(e) {
  // console.log('clicked', e.target);
  // console.log(e.target.parentElement.children[1].innerText);
  console.log(e.target.parentElement.id);
  const parentId = e.target.parentElement.id
  

  let calendarInput = $(`#${parentId} textarea`).val().trim();
  console.log(calendarInput);

  storeData(parentId, calendarInput);
})

const storeData = (id, input) => {
  localStorage.setItem(id, input)
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
setColors = () => {
  const timeBlocks = $('.hour')
  const amPm = dayjs().format(`a`)

  let hourNow = setHour();
  
  for (let i = 0; i < timeBlocks.length; i++) {
    console.dir(timeBlocks[i]);
    let timeInt = parseInt(timeBlocks[i].innerHTML);
    console.log(timeInt)
    
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


// const morning = $('.morning')
// const afternoon = $('.afternoon')

// setMorning = () => {
//   for (let i = 0; i < morning.length; i++) {
//   morning[i].nextSibling.nextElementSibling.className += ' past'
// }
// }

// setAfternoon = () => {
//   for (let i = 0; i < morning.length; i++) {
//     if (timeInt > hourNow) {
//   afternoon[i].nextSibling.nextElementSibling.className += ' future'
//   } else if (timeInt === hourNow) {
//     afternoon[i].nextSibling.nextElementSibling.className += ' present'
//   }
// }
// }

