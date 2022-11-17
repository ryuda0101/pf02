let ham_btn = document.querySelector("header .center .mobile_header .btn");
let close_btn = document.querySelector("header .center .mobile_header .right_menu i"); 
let right_gnb = document.querySelector("header .center .mobile_header .right_menu");

window.addEventListener("resize",() => {
    ham_btn.addEventListener("click",() => {
        mediaCheck();
    });
});

ham_btn.addEventListener("click",() => {
    mediaCheck();
});
close_btn.addEventListener("click",() => {
    right_gnb.style.width = 0;
});

let mediaCheck = () => {
    if(window.matchMedia('screen and (max-width:1200px) and (min-width:1023px)').matches) {
        right_gnb.style.width = "30vw";
    }
    else if (window.matchMedia('screen and (max-width:1023px) and (min-width:768px)').matches) {
        right_gnb.style.width = "50vw";
    }
    else if (window.matchMedia('screen and (max-width:767px)').matches) {
        right_gnb.style.width = "70vw";
    }
}