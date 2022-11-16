let ham_btn = document.querySelector("header .center .mobile_header .btn");
let close_btn = document.querySelector("header .center .mobile_header .right_menu i"); 
let right_gnb = document.querySelector("header .center .mobile_header .right_menu");

ham_btn.addEventListener("click",() => {
    right_gnb.style.width = "30vw";
});
close_btn.addEventListener("click",() => {
    right_gnb.style.width = 0;
});