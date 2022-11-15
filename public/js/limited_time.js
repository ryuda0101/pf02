let left_box = document.querySelector("#container .new_product .center .left_boxs")
let right_boxs = document.querySelector("#container .new_product .center .right_boxs");
let mid_boxs = document.querySelector("#container .new_product .center .mid_boxs");

window.addEventListener("load",() => {
    right_boxs.firstElementChild.classList.add("show");
    mid_boxs.firstElementChild.classList.add("show");
    left_box.firstElementChild.classList.add("on");
});


left_box.querySelectorAll("li").forEach((item, index) => {
    item.addEventListener("click",() => {
        left_box.querySelectorAll("li").forEach((el,index) => {
            el.classList.remove("on");
        });
        item.classList.add("on");
        right_boxs.querySelectorAll(".box").forEach((el,index) => {
            el.classList.remove("show");
        });
        right_boxs.querySelectorAll(".box")[index].classList.add("show");
        mid_boxs.querySelectorAll(".box").forEach((el,index) => {
            el.classList.remove("show");
        });
        mid_boxs.querySelectorAll(".box")[index].classList.add("show");
    });
});