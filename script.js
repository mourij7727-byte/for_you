const screens = [...document.querySelectorAll(".screen")];
const giftButton = document.getElementById("giftButton");
const openGiftButton = document.getElementById("openGift");
const music = document.getElementById("birthdayMusic");
const musicButton = document.getElementById("musicButton");
const toast = document.getElementById("toast");
const screenCounter = document.getElementById("screenCounter");
const journeyProgressBar = document.getElementById("journeyProgressBar");
const photoLightbox = document.getElementById("photoLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");

function showScreen(id) {
  screens.forEach(screen => screen.classList.toggle("active", screen.id === id));
  document.querySelector(".share-qr").hidden = id !== "giftScreen";
  const index = Math.max(0, screens.findIndex(screen => screen.id === id));
  screenCounter.textContent = `Surprise ${index + 1} of ${screens.length}`;
  journeyProgressBar.style.width = `${((index + 1) / screens.length) * 100}%`;
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

function openGift() {
  if (giftButton.classList.contains("opening")) return;
  giftButton.classList.add("opening");
  burstHearts(18);
  setTimeout(() => showScreen("welcomeScreen"), 900);
}
openGiftButton.addEventListener("click", openGift);
giftButton.addEventListener("click", openGift);

document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.next);
    burstHearts(8);
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3600);
}

musicButton.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicButton.textContent = "♫ Pause melody";
      musicButton.setAttribute("aria-pressed", "true");
    } catch (error) {
      showToast("Try tapping Play melody again. This website includes an original instrumental love melody.");
    }
  } else {
    music.pause();
    musicButton.textContent = "♫ Play melody";
    musicButton.setAttribute("aria-pressed", "false");
  }
});

document.getElementById("celebrateButton").addEventListener("click", () => {
  burstHearts(35);
  showToast("Happy Birthday, Ammu! 🎂❤️ Make a beautiful wish!");
});

document.getElementById("replayButton").addEventListener("click", () => {
  giftButton.classList.remove("opening");
  showScreen("giftScreen");
});

function burstHearts(count = 10) {
  const layer = document.getElementById("hearts");
  const symbols = ["♥", "♡", "✦", "❤", "🌸", "🌹", "💐", "🌷"];
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${12 + Math.random() * 22}px`;
    heart.style.animationDuration = `${3 + Math.random() * 3}s`;
    heart.style.animationDelay = `${Math.random() * .6}s`;
    layer.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);
  }
}
setInterval(() => {
  if (document.visibilityState === "visible") burstHearts(1);
}, 1500);


// Hearts and flower petals pop up when the page is tapped.
document.addEventListener("click", (event) => {
  if (event.target.closest("button, a")) return;
  const layer = document.getElementById("hearts");
  const symbols = ["💗", "💖", "🌸", "🌹", "🌷", "💐", "💕"];
  for (let i = 0; i < 9; i++) {
    const pop = document.createElement("span");
    pop.className = "heart-flower-pop";
    pop.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    pop.style.left = `${Math.max(2, Math.min(94, (event.clientX / window.innerWidth) * 100 + (Math.random() * 24 - 12)))}%`;
    pop.style.top = `${Math.max(5, Math.min(85, event.clientY + (Math.random() * 70 - 35)))}px`;
    pop.style.setProperty("--dx", `${Math.random() * 120 - 60}px`);
    layer.appendChild(pop);
    setTimeout(() => pop.remove(), 1500);
  }
});


/* Tap a memory to view it in a full-screen photo viewer. */
document.querySelectorAll(".photo-card img").forEach((photo) => {
  photo.tabIndex = 0;
  photo.setAttribute("role", "button");
  photo.setAttribute("aria-label", `View photo: ${photo.alt}`);
  const openPhoto = () => {
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    lightboxCaption.textContent = photo.closest("figure")?.querySelector("figcaption")?.textContent || photo.alt;
    photoLightbox.hidden = false;
    closeLightbox.focus();
  };
  photo.addEventListener("click", openPhoto);
  photo.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openPhoto(); }
  });
});
function hideLightbox() {
  photoLightbox.hidden = true;
  lightboxImage.src = "";
}
closeLightbox.addEventListener("click", hideLightbox);
photoLightbox.addEventListener("click", (event) => {
  if (event.target === photoLightbox) hideLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !photoLightbox.hidden) hideLightbox();
});

/* Build the share QR from the deployed page URL. */
const shareQrCode = document.getElementById("shareQrCode");
const shareQrLabel = document.getElementById("shareQrLabel");
const currentHost = window.location.hostname;
const isLocalHost = currentHost === "localhost" || currentHost === "127.0.0.1" || currentHost === "0.0.0.0";
const isPrivateNetwork = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(currentHost);

if (window.location.protocol === "file:" || isLocalHost) {
  shareQrCode.textContent = "Open on a hosted page to create a shareable QR.";
  shareQrCode.classList.add("share-qr-placeholder");
  shareQrLabel.textContent = "QR available after deployment";
} else if (window.QRCode) {
  const shareUrl = new URL(window.location.href);
  shareUrl.hash = "";
  new QRCode(shareQrCode, {
    text: shareUrl.href,
    width: 96,
    height: 96,
    correctLevel: QRCode.CorrectLevel.M
  });
  shareQrLabel.textContent = isPrivateNetwork ? "Same Wi-Fi only" : "Scan to open this page";
} else {
  shareQrCode.textContent = "QR could not load.";
  shareQrCode.classList.add("share-qr-placeholder");
  shareQrLabel.textContent = "QR unavailable";
}

/* Initialize the progress indicator on the opening gift screen. */
showScreen("giftScreen");
