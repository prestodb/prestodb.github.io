function scrollEffects(){
  // sequential fadeup for vertical blocks
  document.querySelectorAll('.sequential-fadeup').forEach(item => {
    var thispos= item.getBoundingClientRect(),
    thish = Math.min(item.offsetHeight / 3, 200) ;
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

  //sequential fadein for horizontal blocks
  document.querySelectorAll('.sequential-fadein').forEach(item => {
    var thispos= item.getBoundingClientRect(),
    thish = Math.min(item.offsetHeight / 3, 200) ;
    if (thispos.top < window.innerHeight - thish ){
        var delay = 0;
        item.childNodes.forEach(childItem => {
          setTimeout(function(){ 
            if(childItem.classList){
              childItem.classList.add("revealed")
            }
          },delay * 150);
          delay++;
        });
    }
  });

  //single item fadein
  document.querySelectorAll('.fadein, .slideleft, .slideright').forEach(item => {
    var thispos= item.getBoundingClientRect(),
        thish = Math.min(item.offsetHeight / 3, 200) ;
    if (thispos.top < window.innerHeight - thish ){
        item.classList.add("revealed");
    }
  });

  //countup
  document.querySelectorAll('.countup').forEach(item => {
    var thispos= item.getBoundingClientRect(),
        thish = Math.min(item.offsetHeight / 3, 300) ;
    if (thispos.top < window.innerHeight - thish ){
        item.className = "";
        var s = parseFloat(item.dataset.start), e = parseFloat(item.dataset.end);
        item.innerHTML = s;
        var countUpTimer = setInterval(function(){
          if(s < e) {
            s+= parseFloat(item.dataset.step);
            item.innerHTML = (s.toFixed(item.dataset.places));
          } else {
            clearInterval(countUpTimer);
            item.innerHTML = e;
          }
        },50)
    }
  });
}

document.addEventListener("scroll", scrollEffects);
window.addEventListener("load", scrollEffects);
