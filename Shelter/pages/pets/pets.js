
function openNav() {
  document.querySelector(".menu").style.width = "100vw";
}

function closeNav() {
  document.querySelector(".menu").style.width = "0%";
}

document.querySelector(".mobile_menu").addEventListener("click", openNav);

document.querySelector(".closebtn").addEventListener("click", closeNav);