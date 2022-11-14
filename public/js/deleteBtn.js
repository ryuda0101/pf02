let deleteBtn = document.querySelector(".deleteBtn");

deleteBtn.addEventListener("click",(event) => {
    let check = confirm("게시글을 삭제하시겠습니까?")
    if(!check) {
        event.preventDefault();
    }
})