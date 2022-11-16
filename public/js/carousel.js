let line = document.querySelectorAll("#container .location .center .text_boxs .line");
let carousel01 = document.querySelectorAll("#container .location .center .text_boxs .line .carousel01");
let img = document.querySelectorAll("#container .location .center .img_boxs img");


//자동으로 움직이는 수치값 초기값 0 // 세군데 각각 필요함


//텍스트 들어간 span 가로값 알아내기 -> 조건식으로 끝나는 움직임 위치 확인
let endPoint = line[0].firstElementChild.offsetWidth;

let lineMove = [0,-endPoint,0];

//자동 실행시 marginLeft값 변경되는 함수
let autoMove = (count)=>{

    line.forEach((item,index)=>{
        if(item.classList.contains("right")){
            lineMove[index] = lineMove[index] + count
            item.style.marginLeft = lineMove[index] + "px";
            if(lineMove[index] >= 0){
                item.prepend(item.lastElementChild);
                lineMove[index] = -endPoint;
                item.style.marginLeft = lineMove[index] + "px";
            }
        }
        else{
            lineMove[index] = lineMove[index] - count
            item.style.marginLeft = lineMove[index] + "px";
            if(lineMove[index] < -endPoint){
                item.append(item.firstElementChild)
                lineMove[index] = 0;
                item.style.marginLeft = lineMove[index] + "px";
            }

        }
    });
}


let textMove = setInterval(()=>{
    autoMove(1);
},1)

line.forEach((item,index)=>{
    item.querySelectorAll("span").forEach((spanItem,index)=>{
        spanItem.addEventListener("mouseenter",()=>{
            img[index].classList.add("show");
            clearInterval(textMove);
            textMove = setInterval(()=>{
                autoMove(0.2);
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


