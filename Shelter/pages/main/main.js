
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
const movePosition = slidesToScroll * itemWidth;

items.forEach((items) => {
  items.style.minWidth = `272px`;
});

btnNext.addEventListener('click', () => {   
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
  track.style.transform = `translateX(${position}px)`;
};

const checkBtns = () => {
  btnPrev.disabled = position === 0;
  btnNext.disabled = position <= -(itemsCount - slidesToShow) * itemWidth;
};

checkBtns();

// Modal window

const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');

let petId = 0;

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    reply_click();
    readFile();    
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);    
  });
});

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active');
  modals.forEach(modal => {
    closeModal(modal);
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add('active');
  overlay.classList.add('active');  
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove('active');
  overlay.classList.remove('active');
}

// connecting JSON file
const picture = document.querySelector('.modal_picture_pet');
const title = document.querySelector('.modal_title');
const subtitle = document.querySelector('.modal_subtitle');
const description = document.querySelector('.modal_description');
const age = document.querySelector('.modal_age');
const inoculations = document.querySelector('.modal_inoculations');
const diseases = document.querySelector('.modal_diseases');
const parasites = document.querySelector('.modal_parasites');

function reply_click()
  {  
    petId = event.target.id;
  }

async function readFile() {  
  let response = await fetch('pets.JSON');
  if (response.ok) {
    let json = await response.json();     
    picture.setAttribute("src", json[petId].img);
    picture.setAttribute("alt", json[petId].name);
    title.innerHTML = json[petId].name;
    subtitle.innerHTML = `${json[petId].type} - ${json[petId].breed}`;
    description.innerHTML = json[petId].description;
    age.innerHTML = `<strong>Age:</strong> ${json[petId].age}`;
    inoculations.innerHTML = `<strong>Inoculations:</strong> ${json[petId].inoculations}`;
    diseases.innerHTML = `<strong>Diseases:</strong> ${json[petId].diseases}`;
    parasites.innerHTML = `<strong>Parasites:</strong> ${json[petId].parasites}`;

  }
}