let line = document.querySelectorAll("#container .carousel .center .text_boxs .line");
let carousel01 = document.querySelectorAll("#container .carousel .center .text_boxs .line .carousel01");
let img = document.querySelectorAll("#container .carousel .center .img_boxs img");


//자동으로 움직이는 수치값 초기값 0 // 세군데 각각 필요함


//텍스트 들어간 span 가로값 알아내기 -> 조건식으로 끝나는 움직임 위치 확인
let endPoint = line[0].firstElementChild.offsetWidth;

let lineMove = [0,-endPoint,0];

//자동 실행시 marginLeft값 변경되는 함수
let autoMove = (count)=>{

    line.forEach((item,index)=>{
        item.classList.contains("right") ? rightCheck(count,item,index) : leftCheck(count,item,index);
    });
}

let mouseUpAuto = (aaa,count,count2) =>{
    line.forEach((item,index)=>{
        if(aaa === index){
            item.classList.contains("right") ? rightCheck(count,item,index) : leftCheck(count,item,index);
        }
        else{
            item.classList.contains("right") ? rightCheck(count2,item,index) : leftCheck(count2,item,index);
        }
    });
}

let textMove = setInterval(()=>{autoMove(1);},1)


let rightCheck = (count,item,index) =>{
    lineMove[index] = lineMove[index] + count
    item.style.marginLeft = lineMove[index] + "px";
    if(lineMove[index] >= 0){
        item.prepend(item.lastElementChild);
        lineMove[index] = -endPoint;
        item.style.marginLeft = lineMove[index] + "px";
    }
}

let leftCheck = (count,item,index) =>{
    lineMove[index] = lineMove[index] - count
    item.style.marginLeft = lineMove[index] + "px";
    if(lineMove[index] < -endPoint){
        item.append(item.firstElementChild)
        lineMove[index] = 0;
        item.style.marginLeft = lineMove[index] + "px";
    }
}

line.forEach((item,index)=>{
    item.querySelectorAll("span").forEach((spanItem,index)=>{
        spanItem.addEventListener("mouseenter",()=>{
            img[index].classList.add("show");
            clearInterval(textMove);
            let aaa = Number(spanItem.parentElement.getAttribute("data-index"));
            textMove = setInterval(()=>{
                // autoMove(0.2);
                mouseUpAuto(aaa,0.2,1);
            },1)
        });
        spanItem.addEventListener("mouseleave",()=>{
            img[index].classList.remove("show");
            clearInterval(textMove);
            textMove = setInterval(()=>{
                autoMove(1);
            },1)
        });
    });
})


