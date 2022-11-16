let slide = document.querySelector("#container .slider .center .view .wide");
let nextbtn = document.querySelector("#container .slider .center .view .btns .point_btns .right");
let prevbtn = document.querySelector("#container .slider .center .view .btns .point_btns .left");
let circlebtn = document.querySelectorAll("#container .slider .center .view .btns .circle_btns span");
let dummyNum = 0;

nextbtn.addEventListener("click",() => {
    if (dummyNum < slide.querySelectorAll("div").length - 1) {
        dummyNum++;
    }
    else {
        dummyNum = 0;
    }
    moveSlide();
    circleBtn();
});

prevbtn.addEventListener("click",() => {
    console.log(dummyNum);
    if (dummyNum == 0) {
        dummyNum = slide.querySelectorAll("div").length - 1;
    }
    else {
        dummyNum--;
    }
    moveSlide();
    circleBtn();
});

circlebtn.forEach((item, index) => {
    item.addEventListener("click",() => {
        dummyNum = index;
        moveSlide();
        circleBtn();
    });
});

function circleBtn () {
    circlebtn.forEach((item, index) => {
        item.classList.remove("on")
    });
    circlebtn[dummyNum].classList.add("on");
} 

function moveSlide () {
    slide.style.marginLeft =  dummyNum * -100 + "%";
}