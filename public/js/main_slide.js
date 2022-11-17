let slide = document.querySelector("#container .slider .center .view .wide");
let nextbtn = document.querySelector("#container .slider .center .view .btns .point_btns .right");
let prevbtn = document.querySelector("#container .slider .center .view .btns .point_btns .left");
let circlebtn = document.querySelectorAll("#container .slider .center .view .btns .circle_btns span");
let dummyNum = 0;

// 슬라이드 자동실행
let autoPlay = setInterval(() => {
    nextCheck();
    circleBtn();
    moveSlide();
},3000);

nextbtn.addEventListener("click",() => {
    nextCheck();
    moveSlide();
    circleBtn();
});

prevbtn.addEventListener("click",() => {
    prevCheck();
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

function nextCheck () {
    if (dummyNum < slide.querySelectorAll("div").length - 1) {
        dummyNum++;
    }
    else {
        dummyNum = 0;
    }
}

function prevCheck () {
    console.log(dummyNum);
    if (dummyNum == 0) {
        dummyNum = slide.querySelectorAll("div").length - 1;
    }
    else {
        dummyNum--;
    }
}

// 마우스 올리면 자동실행 멈추고
slide.addEventListener("mouseenter",() => {
    clearInterval(autoPlay);
});
// 마우스 내리면 다시 자동실행 시작
slide.addEventListener("mouseleave",() => {
    autoPlay = setInterval(() => {
        nextCheck();
        circleBtn();
        moveSlide();
    },3000);
});