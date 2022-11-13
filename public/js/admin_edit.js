let editBtn = document.querySelectorAll(".editBtn");
let cancel = document.querySelectorAll(".cancel");
let prdUpdateForm = document.querySelectorAll(".updateForm")

editBtn.forEach((el,index) => {
    el.addEventListener("click",(event) => {
        event.preventDefault();
        prdUpdateForm[index].style.display = "block";
    });
});
cancel.forEach((el,index) => {
    el.addEventListener("click", (event) => {
        event.preventDefault();
        prdUpdateForm[index].style.display = "none";
    });
});