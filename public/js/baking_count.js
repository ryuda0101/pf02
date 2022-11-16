let countStart = document.querySelector("#container .bake_count");
let num = 0;
let countShow = document.querySelector("#container .bake_count .center .count_list .count span");

console.log(countStart.offsetTop);

window.addEventListener("load",() => {
    countStart = countStart.offsetTop;
})
window.addEventListener("resize",() => {
    countStart = document.querySelector("#container .bake_count");
    countStart = countStart.offsetTop;
})

window.addEventListener("scroll",() => {
    let scTop = window.scrollY;
    if(scTop >= countStart) {
        let count = setInterval(() => {
            console.log(num);
            num += 1;
            if(num >= 1176) {
                clearInterval(count);
                countShow.innerHTML = 1176;
            }
            else {
                countShow.innerHTML = num;
            }
        },100);
    }
});