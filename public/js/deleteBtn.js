let deleteBtn = document.querySelector(".deleteBtn");

deleteBtn.addEventListener("click",(event) => {
    check = confirm("삭제하시겠습니까?")
    if(!check) {
        event.preventDefault();
    }
})