// =====================
// APP.JS (CORREGIDO)
// =====================

document.addEventListener("DOMContentLoaded", () => {

  // =====================
  // MÚSICA (sin botón visible)
  // =====================
  const bgm = document.getElementById("bgm");
  const hero = document.getElementById("hero");
  const musicHint = document.getElementById("musicHint"); // si lo tienes en HTML
  let playing = false;

  async function tryAutoPlay(){
    if (!bgm) return;
    try{
      bgm.volume = 0.7;
      await bgm.play();
      playing = true;
      hero?.classList.add("heroGlow");
      if (musicHint) musicHint.classList.remove("show");
    }catch{
      // Autoplay bloqueado (normal en iPhone/WhatsApp)
      if (musicHint) musicHint.classList.add("show");
    }
  }

  // Intentar al cargar
  window.addEventListener("load", () => {
    tryAutoPlay();
  });

  // Primer toque: activa música (iPhone/WhatsApp lo requiere)
  document.addEventListener("click", async () => {
    if (!bgm || playing) return;
    try{
      await bgm.play();
      playing = true;
      hero?.classList.add("heroGlow");
      if (musicHint) musicHint.classList.remove("show");
    }catch{}
  }, { passive: true });

  // =====================
  // CUENTA REGRESIVA
  // =====================
  const WEDDING_DATE = new Date("2026-05-25T15:00:00");
  const elD = document.getElementById("d");
  const elH = document.getElementById("h");
  const elM = document.getElementById("m");
  const elS = document.getElementById("s");

  function pad(n){ return String(n).padStart(2,"0"); }

  function tick(){
    if (!elD || !elH || !elM || !elS) return;

    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0){
      elD.textContent = "00";
      elH.textContent = "00";
      elM.textContent = "00";
      elS.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600*24));
    const hours = Math.floor((totalSeconds % (3600*24)) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    elD.textContent = pad(days);
    elH.textContent = pad(hours);
    elM.textContent = pad(mins);
    elS.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);

  // =====================
  // WHATSAPP RSVP (botón simple)
  // =====================
  const WHATSAPP_NUMBER = "5218311616766";
  const waBtn = document.getElementById("waBtn");

  if (waBtn){
    const msg = encodeURIComponent(
`¡Hola! Confirmo mi asistencia a la boda de Jared y Abigail 💍✨
Número de personas: `
    );
    waBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  }

  // =====================
  // RSVP dentro de la página (Nombre + Personas)
  // =====================
  const rsvpName = document.getElementById("rsvpName");
  const rsvpCount = document.getElementById("rsvpCount");
  const rsvpSend = document.getElementById("rsvpSend");
  const rsvpMsg = document.getElementById("rsvpMsg");

  if (rsvpSend && rsvpName && rsvpCount){
    rsvpSend.addEventListener("click", () => {
      const name = rsvpName.value.trim();
      const count = String(rsvpCount.value || "").trim();

      if (!name || !count){
        if (rsvpMsg) rsvpMsg.textContent = "Por favor escribe tu nombre y el número de personas.";
        return;
      }

      const text = encodeURIComponent(
`Confirmación boda Jared & Abigail 💍✨
Nombre: ${name}
Número de personas: ${count}`
      );

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
      window.open(url, "_blank");

      if (rsvpMsg) rsvpMsg.textContent = "Abriendo WhatsApp…";
    });
  }

  // =====================
  // GALERÍA (LIGHTBOX)
  // =====================
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbClose = document.getElementById("lbClose");
  const thumbs = document.querySelectorAll(".gallery img");

  function openLB(src){
    if (!lb || !lbImg) return;
    lbImg.src = src;
    lb.classList.add("open");
  }

  function closeLB(){
    if (!lb) return;
    lb.classList.remove("open");
    if (lbImg) lbImg.src = "";
  }

  thumbs.forEach(img => img.addEventListener("click", () => openLB(img.src)));
  if (lbClose) lbClose.addEventListener("click", closeLB);
  if (lb) lb.addEventListener("click", (e) => { if (e.target === lb) closeLB(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLB(); });

  // =====================
  // Scroll Reveal (borroso → nítido) EN ORDEN
  // =====================
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  let seq = 0;

  const io = new IntersectionObserver((entries) => {
    entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.target.offsetTop - b.target.offsetTop)
      .forEach(entry => {
        const el = entry.target;
        io.unobserve(el);

        const delay = Math.min(seq * 90, 450);
        seq++;

        setTimeout(() => el.classList.add("show"), delay);
      });
  }, { threshold: 0.18 });

  reveals.forEach(el => io.observe(el));

  // =====================
  // Parallax suave HERO
  // =====================
  function parallax(){
    if (!hero) return;
    const y = window.scrollY || 0;
    const offset = Math.round(y * 0.18);
    hero.style.backgroundPosition = `center calc(50% + ${offset}px)`;
  }

  parallax();
  window.addEventListener("scroll", () => {
    requestAnimationFrame(parallax);
  }, { passive: true });

  // =====================
  // Mensaje palabra por palabra + confetti
  // =====================
  const loveSection = document.getElementById("loveSection");
  const loveTextEl = document.getElementById("loveText");
  const confettiEl = document.getElementById("confetti");
  let loveStarted = false;

  function buildWords(){
    if (!loveTextEl) return;
    const text = loveTextEl.getAttribute("data-text") || "";
    const words = text.split(" ").filter(Boolean);
    loveTextEl.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(" ");
  }

  function launchConfetti(){
    if (!confettiEl) return;

    confettiEl.innerHTML = "";
    const pieces = 70;

    for (let i = 0; i < pieces; i++){
      const p = document.createElement("i");
      const palette = [
        "rgba(199,167,106,.95)",
        "rgba(255,255,255,.90)",
        "rgba(235,225,205,.95)"
      ];
      p.style.background = palette[Math.floor(Math.random() * palette.length)];
      p.style.left = Math.random() * 100 + "%";
      p.style.setProperty("--dur", (2.2 + Math.random() * 1.6) + "s");
      p.style.setProperty("--rot", (Math.random() * 180) + "deg");

      const w = 6 + Math.random() * 6;
      const h = 10 + Math.random() * 10;
      p.style.width = w + "px";
      p.style.height = h + "px";
      p.style.animationDelay = (Math.random() * 0.25) + "s";

      confettiEl.appendChild(p);
    }

    setTimeout(() => { confettiEl.innerHTML = ""; }, 4500);
  }

  function startWordByWord(){
    if (!loveTextEl || loveStarted) return;
    loveStarted = true;

    const spans = Array.from(loveTextEl.querySelectorAll(".w"));
    let i = 0;

    const timer = setInterval(() => {
      if (i < spans.length){
        spans[i].classList.add("show");
        i++;
      }else{
        clearInterval(timer);
        launchConfetti();
      }
    }, 120);
  }

  if (loveSection && loveTextEl){
    buildWords();
    const loveIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          startWordByWord();
          loveIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    loveIO.observe(loveSection);
  }

});