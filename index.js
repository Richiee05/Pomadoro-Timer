"use strict";
const minuteEl = document.querySelector(".minutes");
const secondEl = document.querySelector(".seconds");
const progressBar = document.querySelector(".circular-progress");
const pauseBtn = document.querySelector(".pause");
const resumeBtn = document.querySelector(".resume");
const cancelBtn = document.querySelector(".cancel");
const startBtn = document.querySelector(".start");
const container = document.querySelector(".container");
let minutes = `25`;
let seconds = `00`;
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const now = new Date().getTime();
let initialTimer = new Date().setMinutes(
  new Date().getMinutes() + 25,
  new Date().getSeconds(),
  new Date().getMilliseconds()
);
let intialDistance = initialTimer - now;
let timeInterval;

const startTimer = () => {
  container.style.background = ` #fff`;
  initialTimer = new Date().setMinutes(
    new Date().getMinutes() + 25,
    new Date().getSeconds() + 0.4,
    new Date().getMilliseconds()
  );
  updateTimer();
  const now = new Date().getTime();
  intialDistance = initialTimer - now;
};

//Update the timer and progress bar
const updateTimer = () => {
  timeInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = initialTimer - now;
    minutes = Math.floor((distance % hour) / minute);
    seconds = Math.floor((distance % minute) / second);
    afterTimer();
    if (seconds < 10 || seconds == 0) {
      seconds = `0${seconds}`;
    }
    if (minutes < 10 && minutes == 0) {
      minutes = `${minutes}`;
    }
    minuteEl.textContent = minutes;
    secondEl.textContent = seconds;

    localStorage.setItem(
      "Timer",
      JSON.stringify({ minutes: minutes, seconds: seconds })
    );

    //For updating the progres bar
    progressBar.style.background = `conic-gradient(
      #4d5bf9 ${(distance / intialDistance) * 100 * 3.6}deg,
      #cadcff ${(distance / intialDistance) * 100 * 3.6}deg
      )`;
    //to clear the interval and progresss bar
    if (minuteEl.textContent == 0 && secondEl.textContent == 0) {
      progressBar.style.background = `conic-gradient(
        #4d5bf9 ${0}deg,
        #cadcff ${0}deg
        )`;

      //Do some extra stuff
      localStorage.removeItem("Timer");
      //here
    }
  }, 990);
};

const afterTimer = () => {
  if (seconds < 0 && minutes < 0) {
    seconds = `${-seconds}`;
    minutes = `-0${-(minutes + 1)}`;
    console.log(progressBar);
    container.style.background = ` #f9754d`;
    pauseBtn.hidden = true;
    resumeBtn.hidden = true;
    startBtn.hidden = false;
  }
};

//Add evetlisteners
pauseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clearInterval(timeInterval);
  pauseBtn.hidden = true;
  resumeBtn.hidden = false;
});

resumeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clearInterval(timeInterval);
  updateTimer();
  initialTimer = new Date().setMinutes(
    new Date().getMinutes() + Number(minutes),
    new Date().getSeconds() + Number(seconds) + 0.4,
    new Date().getMilliseconds()
  );
  pauseBtn.hidden = false;
  resumeBtn.hidden = true;
});

cancelBtn.addEventListener("click", () => {
  clearInterval(timeInterval);
  initialTimer = new Date().setMinutes(
    new Date().getMinutes() + 25,
    new Date().getSeconds(),
    new Date().getMilliseconds()
  );
  container.style.background = ` #fff`;
  minuteEl.textContent = `25`;
  secondEl.textContent = `00`;
  progressBar.style.background = `conic-gradient(
      #4d5bf9 ${360}deg,
      #cadcff ${360}deg
    )`;
  pauseBtn.hidden = true;
  resumeBtn.hidden = true;
  startBtn.hidden = false;
});

startBtn.addEventListener("click", () => {
  startTimer();
  pauseBtn.hidden = false;
  resumeBtn.hidden = true;
  startBtn.hidden = true;
});

//you will handle the localstorage part
//JSON.parse( localStorage.getItem("Timer"))

const restorePreviousTimer = () => {
  if (localStorage.getItem("Timer")) {
    const timer = JSON.parse(localStorage.getItem("Timer"));
    minuteEl.textContent = timer.minutes;
    secondEl.textContent = timer.seconds;
    if (minuteEl.textContent < 0 || minuteEl.textContent == "-00") {
      initialTimer = new Date().setMinutes(
        new Date().getMinutes() + Number(minuteEl.textContent),
        new Date().getSeconds() + Number(-secondEl.textContent) + 0.2,
        new Date().getMilliseconds()
      );
      console.log(Number(-secondEl.textContent));
    } else {
      initialTimer = new Date().setMinutes(
        new Date().getMinutes() + timer.minutes,
        new Date().getSeconds() + timer.seconds + 0.2,
        new Date().getMilliseconds()
      );
    }
    updateTimer();
    pauseBtn.hidden = false;
    resumeBtn.hidden = true;
    startBtn.hidden = true;
  }
};

window.addEventListener("load", restorePreviousTimer);
