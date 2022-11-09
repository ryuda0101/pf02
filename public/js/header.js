// 변수 세팅
const subGnb_bg = document.querySelector("header .center .subGnb_bg");

const gnb_menu = document.querySelectorAll("header .center .gnb >li");

gnb_menu.forEach((el, index) => {
    el.addEventListener("mouseenter",() => {
        subGnb_bg.style.height = "130px";
    });
    el.addEventListener("mouseleave",() => {
        subGnb_bg.style.height = 0 ;
    });
});