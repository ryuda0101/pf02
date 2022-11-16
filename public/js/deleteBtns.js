let deleteBtns = document.querySelectorAll(".deleteBtn");
        
deleteBtns.forEach((item, index) => {
    item.addEventListener("click",(event) => {
        check = confirm("삭제하시겠습니까?")
        if(!check) {
            event.preventDefault();
        }
    });
});