let eventSlide = document.querySelector("#container .news .center .view .boxs");
let upbtn = document.querySelector("#container .news .center .view .btns .up");
let downbtn = document.querySelector("#container .news .center .view .btns .down");
let eventDummyNum = 0;

upbtn.addEventListener("click",() => {
    if(window.matchMedia('screen and (min-width:1025px)').matches) {
        lengthCheck(5);
    }
    else if (window.matchMedia('screen and (max-width:1024px) and (min-width:769px)').matches) {
        lengthCheck(4);
    }
    else if (window.matchMedia('screen and (max-width:768px) and (min-width:580px)').matches) {
        lengthCheck(3);
    }
    Upmove();
});
downbtn.addEventListener("click",() => {
    if(window.matchMedia('screen and (max-width:1200px) and (min-width:1025px)').matches) {
        lengthCheck(5);
    }
    else if (window.matchMedia('screen and (max-width:1024px) and (min-width:769px)').matches) {
        lengthCheck(4);
    }
    else if (window.matchMedia('screen and (max-width:768px) and (min-width:580px)').matches) {
        lengthCheck(3);
    }
    Downmove();
});


function Upmove () {
    eventSlide.style.marginTop =  eventDummyNum * -175 + "px";
}

function Downmove () {
    eventSlide.style.marginTop =  eventDummyNum * 175 + "px";
}

function lengthCheck (minus_num) {
    if (eventDummyNum < eventSlide.querySelectorAll("div").length - minus_num) {
        eventDummyNum++;
    }
    else {
        eventDummyNum = 0;
    }
}