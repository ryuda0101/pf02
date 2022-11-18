let blur_bg = document.querySelector("header .center .blur_bg");
let ham_btn = document.querySelector("header .center .mobile_header .btn");
let ham_btns = document.querySelectorAll("header .center .mobile_header .btn span");
let right_gnb = document.querySelector("header .center .mobile_header .right_menu");

window.addEventListener("resize",() => {
    ham_btn.addEventListener("click",() => {
        ham_gnb_act();
    });
});


ham_btn.addEventListener("click",() => {
    ham_gnb_act();
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

let ham_gnb_act = () => {
    if (right_gnb.offsetWidth == 0) {
        for(let i = 0; i <ham_btns.length; i++) {
            ham_btns[i].classList.add("on");
        }
        blur_bg.style.display = "block";
        mediaCheck();
    }
    else {
        for(let i = 0; i <ham_btns.length; i++) {
            ham_btns[i].classList.remove("on");
        }
        right_gnb.style.width = 0;
        blur_bg.style.display = "none";
    }
}


let right_gnb_menu = document.querySelectorAll("header .center .mobile_header .right_menu .ham_gnb >li");

right_gnb_menu.forEach((item, index) => {
    item.addEventListener("click", (event) => {
        right_gnb_menu.forEach((item, index) => {
            item.querySelector(".ham_sub_gnb").style.height = "0";
        });
        let length_num = item.querySelectorAll("ul li").length;
        item.querySelector(".ham_sub_gnb").style.height = 40 * length_num + "px";
    });
});