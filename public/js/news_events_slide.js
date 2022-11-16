let eventSlide = document.querySelector("#container .news .center .view .boxs");
let upbtn = document.querySelector("#container .news .center .view .btns .up");
let downbtn = document.querySelector("#container .news .center .view .btns .down");
let eventDummyNum = 0;

upbtn.addEventListener("click",() => {
    // console.log(eventSlide.querySelectorAll("div").length);
    console.log(eventDummyNum);
    if (eventDummyNum < eventSlide.querySelectorAll("div").length - 5) {
        eventDummyNum++;
    }
    else {
        eventDummyNum = 0;
    }
    move();
});

downbtn.addEventListener("click",() => {
    if (eventDummyNum == 0) {
        eventDummyNum = eventSlide.querySelectorAll("div").length - 5;
    }
    else {
        eventDummyNum--;
    }
    move();
});


function move () {
    eventSlide.style.marginTop =  eventDummyNum * -175 + "px";
}