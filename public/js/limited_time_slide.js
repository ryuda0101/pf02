let prd_view = document.querySelector("#container .new_product .mobile_prd_list");
let prd_num = 0;

let prd_auto_play = setInterval(() => {
    prd_slide();
},1000)

prd_view.addEventListener("mouseenter",() => {
    clearInterval(prd_auto_play);
});
prd_view.addEventListener("mouseleave",() => {
    prd_auto_play = setInterval(() => {
        prd_slide();
    },1000)
});

let prd_slide = () => {
    prd_view.style.marginLeft = prd_num * -33.333333 + "%";
    if(prd_num < prd_view.querySelectorAll("div").length - 3) {
        prd_num = prd_num + 1;
    }
    else {
        prd_num = 0
    }
}