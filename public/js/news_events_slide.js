let eventSlide = document.querySelector("#container .news .center .view .boxs");
let upbtn = document.querySelector("#container .news .center .view .btns .up");
let downbtn = document.querySelector("#container .news .center .view .btns .down");
let eventDummyNum = 0;

upbtn.addEventListener("click",() => {
    if(window.matchMedia('screen and (min-width:1025px)').matches) {
        upLengthCheck(5);
    }
    else if (window.matchMedia('screen and (max-width:1024px) and (min-width:769px)').matches) {
        upLengthCheck(4);
    }
    else if (window.matchMedia('screen and (max-width:768px) and (min-width:580px)').matches) {
        upLengthCheck(3);
    }
    move();
});
downbtn.addEventListener("click",() => {
    if(window.matchMedia('screen and (min-width:1025px)').matches) {
        downLengthCheck(5);
    }
    else if (window.matchMedia('screen and (max-width:1024px) and (min-width:769px)').matches) {
        downLengthCheck(4);
    }
    else if (window.matchMedia('screen and (max-width:768px) and (min-width:580px)').matches) {
        downLengthCheck(3);
    }
    move();
});


function move () {
    eventSlide.style.marginTop =  eventDummyNum * -175 + "px";
}

function downLengthCheck (minus_num) {
    if (eventDummyNum < eventSlide.querySelectorAll("div").length - minus_num) {
        eventDummyNum++;
    }
    else {
        eventDummyNum = 0;
    }
}

function upLengthCheck (minus_num) {
    if (eventDummyNum == 0) {
        eventDummyNum = eventSlide.querySelectorAll("div").length - minus_num;
    }
    else {
        eventDummyNum--;
    }
}