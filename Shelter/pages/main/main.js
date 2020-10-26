
function openNav() {
  document.querySelector(".menu").style.width = "100vw";
}

function closeNav() {
  document.querySelector(".menu").style.width = "0%";
}

function goToPets() {
  location.href = "../pets/pets.html"
}

document.querySelector(".friends__button").addEventListener("click", goToPets);
document.querySelector(".content-section__button").addEventListener("click", goToPets);

document.querySelector(".mobile_menu").addEventListener("click", openNav);

document.querySelector(".closebtn").addEventListener("click", closeNav);

// Slider

let position = 0;
let slidesToShow = 3;
const slidesToScroll = 1;

const container = document.querySelector(".slider__content");
const track = document.querySelector(".slider__track");
const items = document.querySelectorAll(".slider__item");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const itemsCount = items.length;

const itemWidth = container.clientWidth / slidesToShow;
if (container.clientWidth < 768) {
  slidesToShow = 1;
};
console.log(slidesToShow);
console.log(container.clientWidth);
const movePosition = slidesToScroll * itemWidth;

items.forEach((items) => {
  items.style.minWidth = `272px`;
});

btnNext.addEventListener('click', () => {
  console.log(itemWidth);  
  const itemsLeft = itemsCount - (Math.abs(position) + slidesToShow * itemWidth) / itemWidth;
  
  position -= itemsLeft >= slidesToScroll? movePosition : itemsLeft * itemWidth;
 
  setPosition();
  checkBtns();
});

btnPrev.addEventListener('click', () => {
  const itemsLeft = Math.abs(position) / itemWidth;  

  position += itemsLeft >= slidesToScroll? movePosition : itemsLeft * itemWidth;

  setPosition();
  checkBtns();
});

const setPosition = () => {
  console.log(position);
  track.style.transform = `translateX(${position}px)`;
};

const checkBtns = () => {
  btnPrev.disabled = position === 0;
  btnNext.disabled = position <= -(itemsCount - slidesToShow) * itemWidth;
};

checkBtns();



