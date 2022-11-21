let currentPath = window.location.pathname;
const typeBtns = document.querySelectorAll(".type_btns li");

typeBtns.forEach((item,index)=>{
   let childRef = item.querySelector("a").getAttribute("href");
   if(currentPath === childRef){
        item.classList.add("on");
   }
});