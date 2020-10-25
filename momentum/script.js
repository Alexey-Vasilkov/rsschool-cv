// DOM Elements
const time = document.querySelector(".time"),
  dayOfWeek = document.querySelector(".date"),
  greeting = document.querySelector(".greeting"),
  name = document.querySelector(".name"),
  focus = document.querySelector(".focus");

// API key for current weather
const API_KEY = "1fda0f3c47d8ae47626d96fcb91a6f6a";

// Show Time
function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();
  ;

  // 24hr Format
  hour = hour % 24 || 24;

  // Output Time
  time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;

  setTimeout(showTime, 1000);
}

// Show Date

function showDate() {
  let today = new Date(),
    date = today.getDate();
    day = today.getDay();
    month = today.getMonth();    
  ;

  let weekDay = "";
  let currentMonth = "";

  // Days of week
  switch(day) {
    case 0:
      weekDay = "Воскресенье";
      break;
    case 1:
      weekDay = "Понедельник";
      break;
    case 2:
      weekDay = "Вторник";
      break;
    case 3:
      weekDay = "Среда";
      break;
    case 4:
      weekDay = "Четверг";
      break;
    case 5:
      weekDay = "Пятница";
      break;
    case 6:
      weekDay = "Суббота";
      break; 
  } 

  // Month
  switch(month) {
    case 0:
      currentMonth = "Января";
      break;
    case 1:
      currentMonth = "Февраля";
      break;
    case 2:
      currentMonth = "Марта";
      break;
    case 3:
      currentMonth = "Апреля";
      break;
    case 4:
      currentMonth = "Мая";
      break;
    case 5:
      currentMonth = "Июня";
      break;
    case 6:
      currentMonth = "Июля";
      break;
    case 7:
      currentMonth = "Августа";
      break;
    case 8:
      currentMonth = "Сентября";
      break;
    case 9:
      currentMonth = "Октября";
      break;
    case 10:
      currentMonth = "Ноября";
      break;
    case 11:
      currentMonth = "Декабря";
      break;    
  }
 
  // Output Date
  dayOfWeek.innerHTML = `${weekDay}, ${date} ${currentMonth}`;
}

// Add Zeros
function addZero(n) {
  return (parseInt(n, 10) < 10 ? "0" : "") + n;
}

// Set Background and Greeting
function setBgGreet() {
  let today = new Date(),
    hour = today.getHours();
    console.log(hour);

  if (hour >= 6 && hour < 12) {
    // Morning
    document.body.style.backgroundImage = "url('assets/images/morning/01.jpg')";
    greeting.textContent = "Доброе утро, ";
  } else if (hour >= 12 && hour < 18) {
    // Afternoon
    document.body.style.backgroundImage = "url('assets/images/day/01.jpg')";
    greeting.textContent = "Добрый день, ";
  } else if (hour >= 18 && hour < 24) {
    // Evening
    document.body.style.backgroundImage = "url('assets/images/evening/01.jpg')";
    greeting.textContent = "Добрый вечер, ";
    document.body.style.color = "white";
  } else {
    // Night
    document.body.style.backgroundImage = "url('assets/images/night/01.jpg')";
    greeting.textContent = "Доброй ночи, ";
    document.body.style.color = "white";
  }
}

// Set location from input
function setLocation() {
  let locationName = document.querySelector('.search__input').value;
  localStorage.clear();
  localStorage.setItem("locationName", `${locationName}`); 
  input.value = ""; 
  window.location.reload();
}

// Refresh Button
const btn = document.querySelector('.btn');


const input = document.querySelector('.search__input');

// Quote element
const blockquote = document.querySelector('blockquote');
const figcaption = document.querySelector('figcaption');

// Weather element
const weatherLocationElement = document.querySelector(".weather_location");
const weatherElement = document.querySelector(".weather_temp");
const weatherIconElement = document.querySelector("#wicon");
const weatherHumidElement = document.querySelector(".weather_humidity");
const weatherWindElement = document.querySelector(".weather_description");

// Get Name
function getName() {
  if (localStorage.getItem("name") === null) {
    name.textContent = "[Enter Name]";
  } else {
    name.textContent = localStorage.getItem("name");
  }
}

// Set Name
function setName(e) {
  if (e.type === "keypress") {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem("name", e.target.innerText);
      name.blur();
    }
  } else {
    localStorage.setItem("name", e.target.innerText);
  }
}

// Get Focus
function getFocus() {
  if (localStorage.getItem("focus") === null) {
    focus.textContent = "[Enter Focus]";
  } else {
    focus.textContent = localStorage.getItem("focus");
  }
}

// Set Focus
function setFocus(e) {
  if (e.type === "keypress") {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem("focus", e.target.innerText);
      focus.blur();
    }
  } else {
    localStorage.setItem("focus", e.target.innerText);
  }
}

const base = 'assets/images/day/';
const images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
let i = 0;

function viewBgImage(data) {
  const body = document.querySelector('body');
  const src = data;
  const img = document.createElement('img');
  img.src = src;
  img.onload = () => {      
    body.style.backgroundImage = `url(${src})`;
  }; 
}

// Swap background image
function getImage() {  
  const index = i % images.length;
  const imageSrc = base + images[index];
  viewBgImage(imageSrc);
  i++;
  btn.disabled = true;
  setTimeout(function() { btn.disabled = false }, 1000);
} 

// Retrieve current weather
async function weatherInfo() {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${localStorage.getItem("locationName")}&appid=${API_KEY}&units=metric&lang=ru`;
  let response = await fetch(url);
  if (response.ok) {
    let json = await response.json();        
    let iconurl = `http://openweathermap.org/img/w/${json['weather']['0']['icon']}.png`;
    weatherLocationElement.innerHTML = `Погода в городе ${localStorage.getItem("locationName")}`;
    weatherElement.innerHTML = `${Math.round(json['main']['temp'])}°C`;
    weatherIconElement.setAttribute("src", iconurl); 
    weatherHumidElement.innerHTML = `Относительная влажность: ${json['main']['humidity']}%, `;
    weatherWindElement.innerHTML = `Скорость ветра: ${Math.round(json['wind']['speed'])} м/с`;
  }
  return ("Ошибка HTTP: " + response.status);      
} 

// Get Quote
async function getQuote() {  
  const url = `https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru`;
  const res = await fetch(url);
  const data = await res.json(); 
  blockquote.textContent = data.quoteText;
  figcaption.textContent = data.quoteAuthor;
}

document.addEventListener('DOMContentLoaded', getQuote);
document.addEventListener('DOMContentLoaded', weatherInfo);
btn.addEventListener('click', getImage);
btn.addEventListener('click', getQuote);

document.querySelector('.search__button').addEventListener("click", setLocation);
input.addEventListener("keyup", function(event) {  
  if (event.keyCode === 13) {    
    event.preventDefault();    
    document.querySelector('.search__button').click();
  }
});

name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);

// Run
showTime();
showDate();
setBgGreet();
getName();
getFocus();
