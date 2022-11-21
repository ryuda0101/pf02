let up_btn = document.querySelector("#container .top_btn img");
up_btn.addEventListener("click",() => {
    window.scrollTo({
        top:0,
        behavior:"smooth"
    })
});