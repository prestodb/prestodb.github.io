const ytlbHTML= `<div id="ytlb" class="ytlightbox-overlay"><div class="ytlightbox-overclose"></div><div class="ytlightbox-window"><div id="ytlightboxembed"></div><div class="ytlightbox-close"></div></div></div>`;
document.body.innerHTML+=(ytlbHTML);
let ytlightbox = document.getElementById('ytlb');
ytlightbox.querySelector(".ytlightbox-overclose").addEventListener('click', ev => {
  ytlightbox.className = "ytlightbox-overlay";
  document.body.style.overflow="auto";
  document.getElementById('ytlightboxembed').innerHTML="";
})
ytlightbox.querySelector(".ytlightbox-close").addEventListener('click', ev => {
  ytlightbox.className = "ytlightbox-overlay";
  document.body.style.overflow="auto";
  document.getElementById('ytlightboxembed').innerHTML="";
})

document.querySelectorAll('.ytlightbox').forEach(item => {
  item.addEventListener('click', ev => {
    ev.preventDefault();
    target = ev.currentTarget;
    const urlarr = target.href.split("?v="); 
    const url = urlarr[1].split("&")[0];
    let ytiframe = `<iframe src="https://www.youtube.com/embed/${url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    document.getElementById('ytlightboxembed').innerHTML=ytiframe;
    document.body.style.overflow="hidden";
    ytlightbox.className = "ytlightbox-overlay on";
    setTimeout(function() {
      ytlightbox.className = "ytlightbox-overlay on showing";
    }, 0.5)
  })
})