const burger = document.querySelector(".burger")
const nav =document.querySelector(".navbar__links")
burger.addEventListener("click",()=>{
    burger.classList.toggle("active__burger")
    nav.classList.toggle("_active-links")
})