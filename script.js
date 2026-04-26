  let allPosts = [];
  let currentSlide = 0;

  let slides = [];

  document.body.classList.add("loading");

  /* SLIDER */
  function showSlide(i){
    slides.forEach(s=>{
      s.classList.remove('active');

      // reset text semua slide
      const t = s.querySelector("h1");
      if(t){
        t.classList.remove("animate");
        t.style.animationDelay = "0s";
      }
    });

    slides[i].classList.add('active');

    // 🔥 animasi ulang text slide aktif
    setTimeout(()=>{
  animateText(slides[i]);
}, 50);
  }

  function nextSlide(){
    currentSlide = (currentSlide+1)%slides.length;
    showSlide(currentSlide);
  }

  function prevSlide(){
    currentSlide = (currentSlide-1+slides.length)%slides.length;
    showSlide(currentSlide);
  }

  setInterval(nextSlide,10000);

  /* FETCH */
  let settings = {};

  fetch('https://railway.app')
.then(res => res.json())
.then(res => {
  settings = res;

  // apply ke CSS global
  document.documentElement.style.setProperty('--hero-title-size', settings.hero_title_size);
  document.documentElement.style.setProperty('--section-title-size', settings.section_title_size);
});

  fetch('https://railway.app')
  .then(res=>res.json())
  .then(res=>{
    allPosts = res.data;

    renderFeatured(shuffle(allPosts).slice(0,3));
    renderPosts(shuffle(allPosts).slice(0,12));
  });

  /* RANDOM */
  function shuffle(arr){
    return arr.sort(()=>Math.random()-0.5);
  }

  /* FEATURED */
  function renderFeatured(posts){
    let html='';
    posts.forEach(p=>{
      html+=`
      <div class="card" onclick="openDetail(${p.id})">
        <img src="https://railway.app{p.image}">
        
        <div class="card-body">
          <div class="categories">
            ${
              p.categories && p.categories.length
              ? p.categories.map(c => `<span class="category">${c.name}</span>`).join('')
              : '<span class="category">-</span>'
            }
          </div>
          <h3>${p.title}</h3>
        </div>
      </div>`;
    });
    document.getElementById('featured').innerHTML=html;
  }

  /* GRID */
  function renderPosts(posts){
    let html='';
    posts.forEach(p=>{
      html+=`
      <div class="card" onclick="openDetail(${p.id})">
        <img src="https://railway.app{p.image}">
        
        <div class="card-body">
          <div class="categories">
            ${
              p.categories && p.categories.length
              ? p.categories.map(c => `<span class="category">${c.name}</span>`).join('')
              : '<span class="category">-</span>'
            }
          </div>
          <h3>${p.title}</h3>
        </div>
      </div>`;
    });
    document.getElementById('posts').innerHTML=html;
  }
  /* SEARCH */
  function openSearch(){
    document.getElementById('searchBox').classList.add('active');
  }

  function closeSearch(){
    document.getElementById('searchBox').classList.remove('active');
  }

  function doSearch(){
    const val = document.getElementById('searchInput').value.toLowerCase();

    const filtered = allPosts.filter(p =>
      p.title.toLowerCase().includes(val) ||
      p.categories?.some(c => c.name.toLowerCase().includes(val))
    );

    renderPosts(filtered);

    isSearchMode = true;

    document.getElementById("searchTitle").innerText = "Hasil: " + val;
    document.getElementById("searchTitle").style.display = "block";
    document.getElementById("backHomeBtn").style.display = "inline-block";

    document.querySelector(".featured").parentElement.style.display = "none";

    closeSearch();
  }

  /* ENTER SUPPORT */
  document.getElementById("searchInput").addEventListener("keypress", function(e){
    if(e.key === "Enter"){
      doSearch();
    }
  });

  /* DETAIL */
  function openDetail(id){
    sessionStorage.setItem("lastPage", window.location.href);
    window.location.href="detail.html?id="+id;
  }

  /* DATE */
  function formatDate(date){
    return new Date(date).toLocaleDateString('id-ID');
  }

  /* SCROLL */
  window.onscroll=()=>{
    document.getElementById("topBtn").style.display =
    window.scrollY>200?"block":"none";
  };

  document.getElementById("topBtn").onclick=()=>{
    window.scrollTo({top:0,behavior:'smooth'});
  };

  function goBack(){
    if(isSearchMode){
      isSearchMode = false;

      document.getElementById("searchTitle").style.display = "none";
      document.getElementById("backHomeBtn").style.display = "none";
      document.querySelector(".featured").parentElement.style.display = "block";

      renderPosts(shuffle(allPosts).slice(0,12));

      // 🔥 SCROLL HALUS KE ATAS
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    } else {
      // 🔥 FADE OUT dulu baru pindah
      document.body.style.opacity = "0";

      setTimeout(()=>{
        window.location.href = "index.html";
      }, 300);
    }
  }

  let isSearchMode = false;

function animateText(slide){
  const text = slide.querySelector("h1");

  // split cuma sekali
  if(!text.classList.contains("splitted")){
    splitText(text);
    text.classList.add("splitted");
  }

  // reset
  text.classList.remove("animate");

  setTimeout(()=>{
    text.classList.add("animate");
  }, 50);
}

  window.addEventListener("load", () => {
    // reset scroll
    window.scrollTo(0,0);

    // pastiin slide pertama aktif
    showSlide(0);

    // tunggu render bener2 jadi (ANTI BUG PATAH)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        // hilangin mode loading
        document.body.classList.remove("loading");

      });
    });
  });

  window.addEventListener("load", () => {

  // ambil slide SETELAH DOM READY
  slides = document.querySelectorAll('.slide');

  // reset scroll
  window.scrollTo(0,0);

  // pastiin slide pertama aktif
  currentSlide = 0;
  showSlide(0);

  // delay dikit biar layout stabil (ANTI PATAH FIX)
  setTimeout(() => {

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        document.body.classList.remove("loading");

        animateText(slides[0]);

      });
    });

  }, 50);

});

function splitText(el){
  const text = el.innerText;
  el.innerHTML = "";

  text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.innerText = char === " " ? "\u00A0" : char;

    // random posisi awal (nyebar)
    const x = (Math.random() * 200 - 100).toFixed(0);
    const y = (Math.random() * -200 - 50).toFixed(0);

    span.style.setProperty("--x", x + "px");
    span.style.setProperty("--y", y + "px");
    span.style.setProperty("--delay", (i * 0.05) + "s");

    el.appendChild(span);
  });
}

let lastScroll = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  let currentScroll = window.pageYOffset;

  if(currentScroll <= 0){
    navbar.style.transform = "translateY(0)";
    return;
  }

  if(currentScroll > lastScroll){
    // scroll ke bawah → sembunyi
    navbar.style.transform = "translateY(-100%)";
  } else {
    // scroll ke atas → muncul
    navbar.style.transform = "translateY(0)";
  }

  lastScroll = currentScroll;
}); 