let text_boxs = document.querySelector("#container .carousel .center .text_boxs");
// 움직이는 span태그들이 담긴 부모태그
let line = document.querySelectorAll("#container .carousel .center .text_boxs .line");
// 이미지가 담긴 부모태그
let img = document.querySelectorAll("#container .carousel .center .img_boxs img");

text_boxs.addEventListener("mouseenter",() => {
    text_boxs.querySelectorAll(".line span").forEach((el,index) => {
        el.classList.add("white");
    });
});
text_boxs.addEventListener("mouseleave",() => {
    text_boxs.querySelectorAll(".line span").forEach((el,index) => {
        el.classList.remove("white");
    });
});



// 자동으로 움직이는 수치값 초기값 0 // 세군데 각각 필요함


// 텍스트가 들어간 span 가로값 알아내기 -> 조건식으로 끝나는 움직임 위치 확인
let spanWidth = line[0].firstElementChild.offsetWidth;

// lineMove는 line의 시작 위치값을 담아준다.
let lineMove = [0,-spanWidth,0];

// 자동실행 함수
// 0.1초마다 autoMove함수 실행
let textMove = setInterval(()=>{
    // marginLieft값이 1씩 + 또는 - 되는 동작
    autoMove(1);
},1)

//자동 실행시 marginLeft값 변경되는 함수
// count에는 초기에는 autoMove에서 담아준 데이터값'1'이 들어있음
let autoMove = (count)=>{
    line.forEach((item,index)=>{
        // 만약 line에 right라는 class가 붙어있다면
        if(item.classList.contains("right")){
            // line의 marginLieft값이 +1씩 이동
            rightCheck(count,item,index);
        }
        // 만약 line에 right라는 class가 붙어있지 않다면
        else{
            // line의 marginLieft값이 -1씩 이동
            leftCheck(count,item,index);
        }
    });
}

// 왼쪽으로 움직이는 함수
// 만약 line에 right라는 class가 붙어있지 않다면 아래의 함수 실행
// count에는 초기에는 autoMove에서 담아준 데이터값'1'이 들어있음
// 마우스를 올렸을 때 count에는 mouseUpAutoMove에서 보낸 데이터값 1또는 0.2가 들어있음 
// item에는 반복문에서 담아준 item값이 들어있음
// index에는 반복문에서 담아준 index값이 들어있음
let leftCheck = (count,item,index) => {
    lineMove[index] = lineMove[index] - count;
    item.style.marginLeft = lineMove[index] + "px";
    // span태그가 화면 밖으로 넘어가면 append로 넘어간 span태그를 마지막 순서로 넘겨주기
    if(lineMove[index] < -spanWidth){
        item.append(item.firstElementChild)
        // lineMove에는 span을 넘겨주고 다시 line의 시작 위치값을 담아줘서 넘어간 span의 빈공간을 다음 span이 채워주도록 한다
        lineMove[index] = 0;
        item.style.marginLeft = lineMove[index] + "px";
    }
}

// 오른쪽으로 움직이는 함수
// 만약 line에 right라는 class가 붙어있다면 아래의 함수 실행
// count에는 초기에는 autoMove에서 담아준 데이터값'1'이 들어있음
// 마우스를 올렸을 때 count에는 mouseUpAutoMove에서 보낸 데이터값 1또는 0.2가 들어있음 
// item에는 반복문에서 담아준 item값이 들어있음
// index에는 반복문에서 담아준 index값이 들어있음
let rightCheck = (count,item,index) =>{
    lineMove[index] = lineMove[index] + count;
    item.style.marginLeft = lineMove[index] + "px";
    // span태그가 화면 밖으로 넘어가면 prepend로 넘어간 span태그를 첫번째 순서로 넘겨주기
    if(lineMove[index] >= 0){
        item.prepend(item.lastElementChild);
        // lineMove에는 span을 넘겨주고 다시 line의 시작 위치값을 담아줘서 넘어간 span의 빈공간을 다음 span이 채워주도록 한다
        lineMove[index] = -spanWidth;
        item.style.marginLeft = lineMove[index] + "px";
    }
}

// 특정 span에 마우스를 올렸다면
line.forEach((item,index)=>{
    item.querySelectorAll("span").forEach((spanItem,index)=>{
        spanItem.addEventListener("mouseenter",()=>{
            img[index].classList.add("show");
            // 1. 일단 동작하던 함수를 멈추고
            clearInterval(textMove);
            // 2. 마우스 올린 span태그의 부모대상의 커스텀 태그(사용자 대상 태그)를 가져와서
            //    마우스 올린 span태그의 부모대상의 순번값을 확인해준다.
            //    이때 부모대상에는 html에서 미리 커스텀 태그(사용자 대상 태그)로 순번값을 달아준다.
            let parantIndex = Number(spanItem.parentElement.getAttribute("data-index"));
            // 3. mouseUpAutoMove라는 자동실행 함수를 실행시킨다.
            //    이때 자동실행함수에는 다음의 정보를 보내준다.
            textMove = setInterval(()=>{
                // 마우스를 올린 대상의 부모의 순번값 / 0.1초당 marginLeft해줄 느린 값 / 0.1초당 marginLeft해줄 빠른 값
                mouseUpAutoMove(parantIndex,0.2,1);
            },1)
        });
        // 마우스를 내렸다면
        spanItem.addEventListener("mouseleave",()=>{
            img[index].classList.remove("show");
            // 1. 일단 동작하던 함수를 멈추고
            clearInterval(textMove);
            // 2. 위에서 만든 autoMove라는 자동실행함수에 다시 1을 담아줘서 marginLieft값이 1씩 + 또는 - 동작 되도록 해준다.
            textMove = setInterval(()=>{
                autoMove(1);
            },1)
        });
    });
})

// 마우스를 올렸을 때 동작하는 함수
// 순번값 체크 및 방향체크 -> 마우스 올린대상은 느리게 움직이고 나머지는 빠르게 움직임
let mouseUpAutoMove = (parantIndex,slow,fast) => {
    line.forEach((item,index)=>{
        // 전달된 부모 번호값 체크
        // 마우스를 올린 span의 부모대상태그는 천천히 동작하도록 한다.
        if(parantIndex == index){
            // if(item.classList.contains("right")){
            //     rightCheck(slow,item,index);
            // }
            // else{
            //     leftCheck(slow,item,index);
            // }
            // 마우스를 올린 span의 부모대상태그에 right라는 class가 붙어있다면 오른쪽으로 움직이는 함수실행
            // 마우스를 올린 span의 부모대상태그에 right라는 class가 붙어있지 않다면 왼쪽으로 움직이는 함수실행
            // 여기서 전달되는 slow에는 마우스를 올렸을 때 mouseUpAutoMove에 전달한 slow값 0.2가 담겨있다.
            // item은 마우스를 올린 span의 부모대상태그가 담겨있다.
            // index는 line의 순번값이 담겨있다.
            item.classList.contains("right") ? rightCheck(slow,item,index) : leftCheck(slow,item,index)
        }
        // 마우스를 올린 span의 부모대상태그 이외의 부모태그들은 빠르게 동작하도록 한다.
        else{
            // if(item.classList.contains("right")){
            //     rightCheck(fast,item,index);
            // }
            // else{
            //     leftCheck(fast,item,index);
            // }   
            // 마우스를 올리지 않은 line태그에 right라는 class가 붙어있다면 오른쪽으로 움직이는 함수실행
            // 마우스를 올리지 않은 line태그에 right라는 class가 붙어있지 않다면 왼쪽으로 움직이는 함수실행
            // 여기서 전달되는 fast에는 마우스를 올렸을 때 mouseUpAutoMove에 전달한 fast값 1이 담겨있다.
            // item은 마우스를 올리지 않은 line태그들이 담겨있다.
            // index는 line의 순번값이 담겨있다.
            item.classList.contains("right") ? rightCheck(fast,item,index) : leftCheck(fast,item,index)
        }

    });
}



