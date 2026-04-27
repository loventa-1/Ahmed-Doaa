/* Wedding Invitation · script.js
   Updated data: Ahmed & Doaa, only groom WhatsApp, map link, date etc.
*/

"use strict";

const CONFIG = {
  groomName: "Ahmed",
  brideName: "Doaa",
  groomNameAr: "أحمد",
  brideNameAr: "دعاء",

  weddingDate: "May 13, 2026",
  weddingDateAr: "١٣ مايو ٢٠٢٦",
  weddingTime: "7 pm",
  weddingLocation: "AlRashed Hall",
  weddingLocationAr: "قاعة الراشد",
  weddingMapLink:
    "https://maps.apple/p/GJMB~8Z1LYxqok",

  crestImage:
    "assets/images/Gemini_Generated_Image_aai6peaai6peaai6-removebg-preview.webp",
  doorStaticBg: "assets/images/demo3.webp",
  doorGif: "assets/images/image1.mp4",
  detailsBg: "assets/images/image2.webp",
  musicUrl: "assets/music/music1.mp3",

  groomWhatsappNumber: "201016816280",
  brideWhatsappNumber: "",   // bride number removed -> only groom

  assetsToPreload: [],
};

CONFIG.assetsToPreload = [
  CONFIG.crestImage,
  CONFIG.doorStaticBg,
  CONFIG.doorGif,
  CONFIG.detailsBg,
  CONFIG.musicUrl,
].filter(Boolean);

let currentLang = "en";
let loadProgress = 0;
let doorPlayed = false;
let currentWhatsAppMessage = "";
let bgMusic = null;

const pageLoading = document.getElementById("page-loading");
const pageDoor = document.getElementById("page-door");
const pageDetails = document.getElementById("page-details");
const loadingBar = document.getElementById("loading-bar");
const doorGif = document.getElementById("door-gif");
const doorOverlay = document.getElementById("door-overlay");
const doorGlowRing = document.getElementById("door-glow-ring");
const knockBtn = document.getElementById("knock-btn");
const langBtnDoor = document.getElementById("lang-btn-door");
const langBtnDet = document.getElementById("lang-btn-details");
const rsvpForm = document.getElementById("rsvp-form");
const rsvpSuccess = document.getElementById("rsvp-success");
const particles = document.getElementById("particles");
const petalsWrap = document.getElementById("petals");

function initAudio() {
  bgMusic = document.getElementById("bg-music");
  if (CONFIG.musicUrl && bgMusic) {
    bgMusic.src = CONFIG.musicUrl;
    bgMusic.load();
    bgMusic.loop = true;
    bgMusic.volume = 0;
  }
}

function fadeInMusic(el, vol = 0.65, ms = 1500) {
  if (!el) return;
  el.volume = 0;
  el.play().catch((e) => console.log("Audio autoplay blocked:", e));
  const step = vol / (ms / 50);
  const id = setInterval(() => {
    if (el.volume + step < vol) el.volume += step;
    else {
      el.volume = vol;
      clearInterval(id);
    }
  }, 50);
}

function playDoor() {
  if (doorPlayed) return;
  doorPlayed = true;

  doorGif.src = CONFIG.doorGif;
  doorGif.load();
  doorGif.currentTime = 0;
  doorGif.muted = true;
  doorGif.play().catch((e) => console.warn("Video play error:", e));

  if (bgMusic && CONFIG.musicUrl) {
    bgMusic.currentTime = 0;
    fadeInMusic(bgMusic, 0.65, 1500);
  }

  document.querySelector(".door-bg-wrap").classList.add("revealed");
  if (doorOverlay) doorOverlay.style.opacity = "0";
  if (doorGlowRing) doorGlowRing.classList.add("active");

  if (knockBtn) {
    knockBtn.style.opacity = "0";
    knockBtn.style.pointerEvents = "none";
    knockBtn.style.transform = "scale(0.8)";
  }

  let transitionDone = false;
  const goToDetails = () => {
    if (transitionDone) return;
    transitionDone = true;
    transitionToPage(pageDoor, pageDetails, () => {
      spawnPetals();
      animateDetailCards();
    });
  };

  doorGif.addEventListener("ended", goToDetails, { once: true });
  setTimeout(goToDetails, 15000);
}

function injectContent() {
  document.querySelectorAll(".groom-name-en").forEach(el => el.textContent = CONFIG.groomName);
  document.querySelectorAll(".bride-name-en").forEach(el => el.textContent = CONFIG.brideName);
  document.querySelectorAll(".groom-name-ar").forEach(el => el.textContent = CONFIG.groomNameAr);
  document.querySelectorAll(".bride-name-ar").forEach(el => el.textContent = CONFIG.brideNameAr);

  document.querySelectorAll(".wedding-date-en").forEach(el => el.textContent = CONFIG.weddingDate);
  document.querySelectorAll(".wedding-date-ar").forEach(el => el.textContent = CONFIG.weddingDateAr);
  document.querySelectorAll(".wedding-time").forEach(el => el.textContent = CONFIG.weddingTime);
  document.querySelectorAll(".wedding-location-en").forEach(el => el.textContent = CONFIG.weddingLocation);
  document.querySelectorAll(".wedding-location-ar").forEach(el => el.textContent = CONFIG.weddingLocationAr);
  const mapBtns = document.querySelectorAll(".wedding-map-btn");
  mapBtns.forEach(btn => btn.href = CONFIG.weddingMapLink);

  const year = CONFIG.weddingDate.match(/\d{4}/)?.[0] || "2026";
  document.querySelectorAll(".wedding-year").forEach(el => el.textContent = year);
  document.querySelectorAll(".wedding-year-ar").forEach(el => el.textContent = year);

  const doorStatic = document.querySelector(".door-static-bg");
  if (doorStatic) doorStatic.style.backgroundImage = `url('${CONFIG.doorStaticBg}')`;
  const detailsBgElem = document.querySelector(".details-bg");
  if (detailsBgElem) detailsBgElem.style.backgroundImage = `url('${CONFIG.detailsBg}')`;
  document.querySelectorAll(".crest-img, #hero-crest-img").forEach(img => img.src = CONFIG.crestImage);
}

function spawnParticles() {
  if (!particles) return;
  for (let i = 0; i < 22; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 6 + 2;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;animation-duration:${Math.random() * 12 + 8}s;animation-delay:${Math.random() * 10}s;`;
    particles.appendChild(p);
  }
}

function spawnPetals() {
  if (!petalsWrap) return;
  petalsWrap.innerHTML = "";
  for (let i = 0; i < 18; i++) {
    const p = document.createElement("div");
    p.className = "petal";
    const size = Math.random() * 8 + 4;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;animation-duration:${Math.random() * 18 + 12}s;animation-delay:${Math.random() * 14}s;`;
    petalsWrap.appendChild(p);
  }
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

let loadProgressCurrent = 0;
function setBar(target) {
  const from = loadProgressCurrent;
  const start = performance.now();
  const duration = 400;
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    loadProgressCurrent = from + (target - from) * easeInOut(t);
    loadingBar.style.width = loadProgressCurrent + "%";
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function preloadAllAssets() {
  const total = CONFIG.assetsToPreload.length;
  if (total === 0) return Promise.resolve();
  let loaded = 0;
  const BAR_START = 10, BAR_END = 90;
  function onAssetDone() {
    loaded++;
    const pct = BAR_START + (loaded / total) * (BAR_END - BAR_START);
    setBar(pct);
  }
  const promises = CONFIG.assetsToPreload.map((src) => {
    return new Promise((resolve) => {
      const isVideo = /\.(mp4|webm|mov)$/i.test(src);
      const isAudio = /\.(mp3|wav|ogg)$/i.test(src);
      if (isVideo) {
        const video = document.createElement("video");
        video.preload = "auto";
        video.src = src;
        video.load();
        const timeout = setTimeout(() => resolve(), 12000);
        video.addEventListener("canplaythrough", () => { clearTimeout(timeout); onAssetDone(); resolve(); }, { once: true });
        video.addEventListener("error", () => { clearTimeout(timeout); onAssetDone(); resolve(); }, { once: true });
      } else if (isAudio) {
        const audio = new Audio();
        audio.preload = "auto";
        audio.src = src;
        const timeout = setTimeout(() => resolve(), 12000);
        audio.addEventListener("canplaythrough", () => { clearTimeout(timeout); onAssetDone(); resolve(); }, { once: true });
        audio.addEventListener("error", () => { clearTimeout(timeout); onAssetDone(); resolve(); }, { once: true });
        audio.load();
      } else {
        const img = new Image();
        const timeout = setTimeout(() => resolve(), 12000);
        img.onload = img.onerror = () => { clearTimeout(timeout); onAssetDone(); resolve(); };
        img.src = src;
      }
    });
  });
  return Promise.all(promises);
}

async function runLoadingScreen() {
  setBar(10);
  spawnParticles();
  await Promise.all([preloadAllAssets(), new Promise(r => setTimeout(r, 2000))]);
  setBar(100);
  await new Promise(r => setTimeout(r, 600));
  transitionToPage(pageLoading, pageDoor);
}

function transitionToPage(fromPage, toPage, cb) {
  fromPage.classList.add("fade-out");
  setTimeout(() => {
    fromPage.classList.remove("active", "fade-out");
    toPage.classList.add("active");
    if (cb) cb();
  }, 900);
}

function animateDetailCards() {
  if (!pageDetails) return;
  pageDetails.querySelectorAll(".detail-card").forEach((c, i) => {
    c.style.animation = "cardEntrance 0.8s ease both";
    c.style.animationDelay = i * 0.15 + "s";
  });
}

function toggleLanguage() {
  currentLang = currentLang === "en" ? "ar" : "en";
  document.documentElement.setAttribute("lang", currentLang);
  document.documentElement.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
  const nameInput = document.getElementById("rsvp-name");
  const msgInput = document.getElementById("rsvp-msg");
  if (nameInput) nameInput.placeholder = currentLang === "ar" ? "اسمك..." : "Your name...";
  if (msgInput) msgInput.placeholder = currentLang === "ar" ? "أمنياتك الطيبة..." : "Your warm wishes...";
}

function handleRSVP(event) {
  event.preventDefault();
  const name = document.getElementById("rsvp-name").value.trim();
  const attendInput = document.querySelector('input[name="attend"]:checked');
  const message = document.getElementById("rsvp-msg").value.trim();

  if (!name) {
    alert(currentLang === "ar" ? "الرجاء إدخال اسمك الكامل." : "Please enter your full name.");
    return false;
  }
  if (!attendInput) {
    alert(currentLang === "ar" ? "الرجاء اختيار حالة الحضور." : "Please confirm attendance.");
    return false;
  }

  const attendText = attendInput.value === "yes"
    ? (currentLang === "ar" ? "نعم، سأحضر 🥂" : "Yes, I will attend 🥂")
    : (currentLang === "ar" ? "آسف، لن أتمكن من الحضور" : "Regretfully unable to attend");

  let fullMessage = `Guest: ${name}\nAttendance: ${attendText}`;
  if (message) fullMessage += `\nMessage: ${message}`;
  currentWhatsAppMessage = fullMessage;

  rsvpForm.classList.add("hidden");
  rsvpSuccess.classList.remove("hidden");
  bindWhatsAppButtons();
  return false;
}

function bindWhatsAppButtons() {
  const groomBtn = document.getElementById("send-to-groom");
  const copyBtn = document.getElementById("copy-message");
  if (groomBtn) {
    const newGroom = groomBtn.cloneNode(true);
    groomBtn.parentNode.replaceChild(newGroom, groomBtn);
    newGroom.onclick = (e) => {
      e.preventDefault();
      if (!CONFIG.groomWhatsappNumber) {
        alert(currentLang === "ar" ? "لم يتم تعيين رقم العريس" : "Groom number not set");
        return;
      }
      const url = `https://wa.me/${CONFIG.groomWhatsappNumber}?text=${encodeURIComponent(currentWhatsAppMessage)}`;
      window.open(url, "_blank");
    };
  }
  if (copyBtn) {
    const newCopy = copyBtn.cloneNode(true);
    copyBtn.parentNode.replaceChild(newCopy, copyBtn);
    newCopy.onclick = (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(currentWhatsAppMessage).then(() => {
        alert(currentLang === "ar" ? "تم نسخ الرسالة!" : "Message copied!");
      }).catch(() => {
        alert(currentLang === "ar" ? "فشل النسخ، يمكنك نسخها يدوياً." : "Copy failed, please copy manually.");
      });
    };
  }
}

function enableAudioOnUserInteraction() {
  let activated = false;
  const enable = () => {
    if (activated) return;
    activated = true;
    if (bgMusic && bgMusic.paused && CONFIG.musicUrl) {
      bgMusic.play().then(() => { bgMusic.pause(); bgMusic.currentTime = 0; }).catch(() => {});
    }
    document.removeEventListener("click", enable);
    document.removeEventListener("touchstart", enable);
  };
  document.addEventListener("click", enable);
  document.addEventListener("touchstart", enable);
}

if (knockBtn) knockBtn.addEventListener("click", playDoor);
if (langBtnDoor) langBtnDoor.addEventListener("click", toggleLanguage);
if (langBtnDet) langBtnDet.addEventListener("click", toggleLanguage);
if (rsvpForm) rsvpForm.addEventListener("submit", handleRSVP);

enableAudioOnUserInteraction();

document.addEventListener("DOMContentLoaded", async () => {
  initAudio();
  injectContent();
  bindWhatsAppButtons();
  pageLoading.classList.add("active");
  if (doorGif) doorGif.removeAttribute("src");
  await runLoadingScreen();
});