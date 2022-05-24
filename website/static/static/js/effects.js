
function scrollEffects(){
  document.querySelectorAll('.sequential-fadeup').forEach(item => {
    var thispos= item.getBoundingClientRect(),
        thish = item.offsetHeight / 3 ;
    if (thispos.top < window.innerHeight - thish ){
        var delay = 0;
        item.childNodes.forEach(childItem => {
          setTimeout(function(){ 
            if(childItem.classList){
              childItem.classList.add("revealed")
            }
          },delay * 100);
          delay++;
        });
    }
  });
}

document.addEventListener("scroll", scrollEffects);
window.addEventListener("load", scrollEffects);