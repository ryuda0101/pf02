// 시, 도 나오게 하는 select 태그 변수로 세팅
const city1 = document.querySelectorAll(".sido");
// 구, 군 나오게 하는 select 태그 변수로 세팅
const city2 = document.querySelectorAll(".gugun");

city1.forEach((el,index) => {
    for(let i = 0; i < hangjungdong.sido.length; i++) {
        // createElement    →   존재하지 않는 태그를 만드는 속성
        let city1Tag = document.createElement("option");    // 태그생성
        let city1Text = document.createTextNode(hangjungdong.sido[i].codeNm);   // 태그에 들어갈 텍스트 생성
        city1Tag.append(city1Text);
        city1Tag.setAttribute("value",hangjungdong.sido[i].codeNm);     // option의 value값에 지역명을 넣어줌
        city1Tag.setAttribute("data-sido",hangjungdong.sido[i].sido);     // option의 data-sido값에 지역 번호을 넣어줌
        el.append(city1Tag);     // 만들어진 option태그를 select안에 마지막번째 자식으로 계속 추가
    }
    
    // city1 select 태그에 change 이벤트를 사용하여 해당 시/도를 고르면 해당하는 구/군 option 생성
    el.addEventListener("change",() => {
        // selectedIndex    →   선택한 옵션 태그의 순번
        // 선택한 option태그의 data-sido의 값을 가지고 온다.
        let city1Data = el.options[el.selectedIndex].getAttribute("data-sido");
        
        // 구/군 만드는 코드 함수로 만들어서 호출
        gugun(city1Data);
    });
    
    // 시구군 생성하는 코드작업 함수
    const gugun = (city1Data) => {
        // 기존 option태그들 갈아치워주기
        city2[index].innerHTML = "<option value>구/군 선택</option>";
    
        // 반복문을 이용하여 데이터 sido 코드값에 맞는 구/군의 데이터를 기반으로 option태그 생성
        for(let i = 0; i < hangjungdong.sigugun.length; i++) {
            // 전달받은 sido 코드값과 행정동 객체에 있는 sido 코드값하고 일치하면 option 만들어준다.
            if (city1Data == hangjungdong.sigugun[i].sido) {
                let city2Tag = document.createElement("option");    // 태그생성
                let city2Text = document.createTextNode(hangjungdong.sigugun[i].codeNm);   // 태그에 들어갈 텍스트 생성
                city2Tag.append(city2Text);
                city2Tag.setAttribute("value",hangjungdong.sigugun[i].codeNm);     // option의 value값에 지역명을 넣어줌
                city2[index].append(city2Tag);     // 만들어진 option태그를 select안에 마지막번째 자식으로 계속 추가
            }
        } 
    }
});
