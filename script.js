// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingBar = document.getElementById('loadingBar');
  const loadingText = document.getElementById('loadingText');

  const messages = [
    'Loading your invitation...',
    'Preparing something special...',
    'Almost ready...',
    'Welcome! 💍'
  ];

  let progress = 0;
  let msgIndex = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 12 + 5;
    if (progress > 100) progress = 100;

    loadingBar.style.width = progress + '%';

    // Change message
    const newIndex = Math.floor((progress / 100) * messages.length);
    if (newIndex !== msgIndex && newIndex < messages.length) {
      msgIndex = newIndex;
      loadingText.textContent = messages[msgIndex];
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 600);
    }
  }, 150);
});

// ===== PAGE 1 — Tap to Open =====
const tapBtn = document.getElementById('tapBtn');

tapBtn.addEventListener('click', function () {
  document.querySelector('.left-curtain').classList.add('open');
  document.querySelector('.right-curtain').classList.add('open');
  tapBtn.style.opacity = '0';
  tapBtn.style.pointerEvents = 'none';

  setTimeout(() => {
    goToPage('page-2');
    setTimeout(() => {
      document.querySelector('.reveal-center').classList.add('show');
    }, 300);
  }, 1300);
});

// ===== PAGE SWITCHER =====
function goToPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  // Show target page
  const target = document.getElementById(pageId);
  target.style.display = 'flex';
  target.classList.add('active');

  // Show scroll hint when page-2 activates
  const hint = document.getElementById('globalScrollHint');
  if (hint) {
    if (pageId === 'page-2') {
      hint.classList.add('visible');
      hint.classList.remove('hidden');
    } else {
      hint.classList.remove('visible');
      hint.classList.add('hidden');
    }
  }
}

// ===== SCRATCH CARD =====
window.addEventListener('load', () => {
  const canvas = document.getElementById('scratchCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = 300;
  canvas.height = 200;

  // Gold scratch surface
  const gradient = ctx.createLinearGradient(0, 0, 300, 280);
  gradient.addColorStop(0, '#c9a84c');
  gradient.addColorStop(0.5, '#f0d080');
  gradient.addColorStop(1, '#c9a84c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 300, 280);

  // Text on surface
  ctx.fillStyle = 'rgba(100, 70, 0, 0.5)';
  ctx.font = 'bold 16px Georgia';
  ctx.textAlign = 'center';
  ctx.fillText('✦ Scratch Here ✦', 150, 95);
  ctx.font = '12px Georgia';
  ctx.fillText('Reveal the surprise inside', 150, 118);

  let isScratching = false;
  let fireworksDone = false;

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function scratch(e) {
    e.preventDefault();
    if (!isScratching) return;
    const pos = getPos(e, canvas);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
    ctx.fill();
    checkScratchPercent();
  }

  function checkScratchPercent() {
    if (fireworksDone) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 128) transparent++;
    }
    const percent = (transparent / (canvas.width * canvas.height)) * 100;
    if (percent > 60) {
      fireworksDone = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      launchFireworks();
    }
  }

  canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
  canvas.addEventListener('mousemove', scratch);
  canvas.addEventListener('mouseup', () => isScratching = false);
  canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); }, { passive: false });
  canvas.addEventListener('touchmove', scratch, { passive: false });
  canvas.addEventListener('touchend', () => isScratching = false);
});

// ===== FIREWORKS =====
function launchFireworks() {
  const container = document.getElementById('fireworks');
  const colors = ['#c9a84c', '#f0d080', '#ff6b9d', '#a8e6cf', '#ffffff', '#ff9f43'];

  let count = 0;
  const interval = setInterval(() => {
    for (let i = 0; i < 12; i++) {
      const fw = document.createElement('div');
      fw.classList.add('firework');

      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight * 0.7;
      const angle = Math.random() * 360;
      const distance = 60 + Math.random() * 120;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      fw.style.left = startX + 'px';
      fw.style.top = startY + 'px';
      fw.style.background = colors[Math.floor(Math.random() * colors.length)];
      fw.style.setProperty('--tx', tx + 'px');
      fw.style.setProperty('--ty', ty + 'px');
      fw.style.animationDuration = (0.6 + Math.random() * 0.8) + 's';

      container.appendChild(fw);
      setTimeout(() => fw.remove(), 1200);
    }
    count++;
    if (count > 6) clearInterval(interval);
  }, 300);
}

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
  const weddingDate = new Date('2026-05-15T14:00:00');
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-minutes').textContent = '00';
    document.getElementById('cd-seconds').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== MUSIC PLAYER =====
const songs = [
  'audio/song1.mp3',
  'audio/song2.mp3'
];

let currentSong = 0;
let isMuted = false;
const bgMusic = document.getElementById('bgMusic');
const muteBtn = document.getElementById('muteBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const musicPlayer = document.getElementById('musicPlayer');

// Load and play song
function loadSong(index) {
  bgMusic.src = songs[index];
  bgMusic.load();
  bgMusic.play().catch(() => { });
}

// Auto play immediately when user first taps (page 1)
document.getElementById('tapBtn').addEventListener('click', function () {
  loadSong(currentSong);
  musicPlayer.classList.add('visible');
}, { once: true });

// Mute / Unmute
muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  bgMusic.muted = isMuted;
  muteBtn.textContent = isMuted ? '🔇' : '🔊';
});

// Next song
nextBtn.addEventListener('click', () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
});

// Previous song
prevBtn.addEventListener('click', () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
});

// Auto next song when current ends
bgMusic.addEventListener('ended', () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
});

// ===== FLOATING PARTICLES =====
const particleCanvas = document.getElementById('particleCanvas');
const pCtx = particleCanvas.getContext('2d');

particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
});

const particles = [];

// Particle types
const types = ['gold', 'star', 'petal'];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function createParticle() {
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    type,
    x: randomBetween(0, particleCanvas.width),
    y: randomBetween(-20, -100),
    size: type === 'petal' ? randomBetween(8, 16) : randomBetween(2, 5),
    speedY: randomBetween(0.5, 1.8),
    speedX: randomBetween(-0.5, 0.5),
    rotation: randomBetween(0, 360),
    rotationSpeed: randomBetween(-1.5, 1.5),
    opacity: randomBetween(0.4, 0.9),
    swing: randomBetween(0.3, 0.8),
    swingSpeed: randomBetween(0.01, 0.03),
    swingAngle: randomBetween(0, Math.PI * 2),
  };
}

// Initialize particles
for (let i = 0; i < 60; i++) {
  const p = createParticle();
  p.y = randomBetween(0, particleCanvas.height); // spread initially
  particles.push(p);
}

function drawPetal(ctx, x, y, size, rotation, opacity) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.globalAlpha = opacity;

  // Rose petal shape
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(size, -size, size * 2, size, 0, size * 2);
  ctx.bezierCurveTo(-size * 2, size, -size, -size, 0, 0);

  // Pink/red gradient for petal
  const gradient = ctx.createRadialGradient(0, size, 0, 0, size, size * 2);
  gradient.addColorStop(0, 'rgba(255, 182, 193, 0.9)');
  gradient.addColorStop(0.5, 'rgba(255, 105, 135, 0.7)');
  gradient.addColorStop(1, 'rgba(200, 60, 100, 0.4)');

  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

function drawGoldDust(ctx, x, y, size, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(240, 208, 128, ${opacity})`;
  ctx.fill();

  // Glow effect
  ctx.beginPath();
  ctx.arc(x, y, size * 2, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(201, 168, 76, ${opacity * 0.3})`;
  ctx.fill();
  ctx.restore();
}

function drawStar(ctx, x, y, size, rotation, opacity) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.globalAlpha = opacity;

  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = Math.cos(angle) * size;
    const py = Math.sin(angle) * size;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = `rgba(255, 223, 100, ${opacity})`;
  ctx.shadowColor = 'rgba(255, 200, 50, 0.8)';
  ctx.shadowBlur = 6;
  ctx.fill();
  ctx.restore();
}

function animateParticles() {
  pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

  particles.forEach((p, i) => {
    // Swing motion
    p.swingAngle += p.swingSpeed;
    p.x += Math.sin(p.swingAngle) * p.swing + p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;

    // Draw based on type
    if (p.type === 'petal') {
      drawPetal(pCtx, p.x, p.y, p.size, p.rotation, p.opacity);
    } else if (p.type === 'gold') {
      drawGoldDust(pCtx, p.x, p.y, p.size, p.opacity);
    } else if (p.type === 'star') {
      drawStar(pCtx, p.x, p.y, p.size, p.rotation, p.opacity);
    }

    // Reset when out of screen
    if (p.y > particleCanvas.height + 30) {
      particles[i] = createParticle();
    }
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

// ===== GOOGLE SHEET URL =====
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxKGZpkQX92nhM-yiiIQjQZ6cwBFiyKruNvQQLPTcE3nupjIkeNVDqgwS-PV5lZ9MyHMA/exec';

// ===== RSVP =====
let rsvpChoice = '';

function selectChoice(choice) {
  rsvpChoice = choice;
  document.getElementById('choiceYes').classList.remove('selected-yes');
  document.getElementById('choiceNo').classList.remove('selected-no');
  if (choice === 'yes') {
    document.getElementById('choiceYes').classList.add('selected-yes');
  } else {
    document.getElementById('choiceNo').classList.add('selected-no');
  }
}

function submitRSVP() {
  const name = document.getElementById('rsvpName').value.trim();
  const message = document.getElementById('rsvpMessage').value.trim();

  if (!name) { alert('Please enter your name!'); return; }
  if (!rsvpChoice) { alert('Please let us know if you will attend!'); return; }

  const btn = document.getElementById('rsvpSubmitBtn');
  btn.textContent = '⏳ Submitting...';
  btn.disabled = true;

  const attendance = rsvpChoice === 'yes' ? '✅ Joyfully Accepts' : '❌ Regretfully Declines';

  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'rsvp',
      name: name,
      attendance: attendance,
      message: message
    })
  }).then(() => {
    btn.textContent = '✉️ Confirm Attendance';
    btn.disabled = false;
    document.getElementById('rsvpSuccess').style.display = 'block';
    document.getElementById('rsvpName').value = '';
    document.getElementById('rsvpMessage').value = '';
    rsvpChoice = '';
    document.getElementById('choiceYes').classList.remove('selected-yes');
    document.getElementById('choiceNo').classList.remove('selected-no');
  }).catch(() => {
    btn.textContent = '✉️ Confirm Attendance';
    btn.disabled = false;
    alert('Something went wrong! Please try again.');
  });
}

// ===== WISHES =====
function submitWish() {
  const name = document.getElementById('wishName').value.trim();
  const wish = document.getElementById('wishText').value.trim();

  if (!name) { alert('Please enter your name!'); return; }
  if (!wish) { alert('Please write your wishes!'); return; }

  const btn = document.getElementById('wishSubmitBtn');
  btn.textContent = '⏳ Sending...';
  btn.disabled = true;

  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'wish',
      name: name,
      wish: wish
    })
  }).then(() => {
    btn.textContent = '💝 Send Wishes';
    btn.disabled = false;
    document.getElementById('wishSuccess').style.display = 'block';
    document.getElementById('wishName').value = '';
    document.getElementById('wishText').value = '';
  }).catch(() => {
    btn.textContent = '💝 Send Wishes';
    btn.disabled = false;
    alert('Something went wrong! Please try again.');
  });
}

// ===== GLOBAL SCROLL HINT =====
const scrollHint = document.getElementById('globalScrollHint');
const page2 = document.getElementById('page-2');
const allSections = document.querySelectorAll('.p2-section');
const lastSectionIndex = allSections.length - 1;

// Hide on last section, show on all others via scroll
page2.addEventListener('scroll', () => {
  const sectionHeight = page2.clientHeight;
  const scrollTop = page2.scrollTop;
  const currentIndex = Math.round(scrollTop / sectionHeight);

  if (currentIndex >= lastSectionIndex) {
    scrollHint.classList.add('hidden');
    scrollHint.classList.remove('visible');
  } else {
    scrollHint.classList.remove('hidden');
    scrollHint.classList.add('visible');
  }
});

// ===== WISHES WALL =====
const SHEET_READ_URL = 'https://script.google.com/macros/s/AKfycbxM4ASm7CxL1IyaCFnFH5L9yo2umCI35gMhRF19zHYpZLatQ1Vrz0oKkWe_HLtbLWwacg/exec';
let currentWishIndex = 0;
let wishesData = [];
let touchStartX = 0;
let touchEndX = 0;
let wishesLoaded = false;

function loadWishes() {
  const loading = document.getElementById('wallLoading');
  const empty = document.getElementById('wallEmpty');
  const wrap = document.getElementById('wallCardsWrap');

  loading.style.display = 'flex';
  empty.style.display = 'none';
  wrap.style.display = 'none';

  fetch(SHEET_READ_URL)
    .then(res => res.json())
    .then(data => {
      loading.style.display = 'none';
      if (!data.wishes || data.wishes.length === 0) {
        empty.style.display = 'flex';
        return;
      }
      wishesData = data.wishes.reverse(); // newest first
      currentWishIndex = 0;
      renderWishCards();
      wrap.style.display = 'flex';
    })
    .catch(() => {
      loading.style.display = 'none';
      empty.style.display = 'flex';
    });
}

function renderWishCards() {
  const container = document.getElementById('wallCards');
  const dotsContainer = document.getElementById('wallDots');

  container.innerHTML = '';
  dotsContainer.innerHTML = '';

  wishesData.forEach((w, i) => {
    const card = document.createElement('div');
    card.className = 'wall-card';
    card.innerHTML = `
      <div class="wall-card-quote">"</div>
      <p class="wall-card-wish">${w.wish}</p>
      <div class="wall-card-divider"></div>
      <p class="wall-card-name">— ${w.name}</p>
      <p class="wall-card-date">${w.date || ''}</p>
    `;
    container.appendChild(card);

    const dot = document.createElement('div');
    dot.className = 'wall-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToWish(i);
    dotsContainer.appendChild(dot);
  });

  updateWishPosition();
  setupWishSwipe();
}

function goToWish(index) {
  currentWishIndex = index;
  updateWishPosition();
}

function updateWishPosition() {
  const container = document.getElementById('wallCards');
  const dots = document.querySelectorAll('.wall-dot');
  const cardWidth = document.querySelector('.wall-card')
    ? document.querySelector('.wall-card').offsetWidth
    : 300;
  container.style.transform = `translateX(-${currentWishIndex * cardWidth}px)`;
  container.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  dots.forEach((d, i) => d.classList.toggle('active', i === currentWishIndex));
}

function setupWishSwipe() {
  const container = document.getElementById('wallCards');

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentWishIndex < wishesData.length - 1) currentWishIndex++;
      else if (diff < 0 && currentWishIndex > 0) currentWishIndex--;
      updateWishPosition();
    }
  }, { passive: true });

  container.addEventListener('mousedown', (e) => { touchStartX = e.clientX; });
  container.addEventListener('mouseup', (e) => {
    touchEndX = e.clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentWishIndex < wishesData.length - 1) currentWishIndex++;
      else if (diff < 0 && currentWishIndex > 0) currentWishIndex--;
      updateWishPosition();
    }
  });
}

// Auto-load when Wishes Wall section scrolls into view
page2.addEventListener('scroll', () => {
  if (wishesLoaded) return;
  const wallSection = document.querySelector('.wishes-wall-section');
  if (!wallSection) return;
  const rect = wallSection.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    wishesLoaded = true;
    loadWishes();
  }
});

// ===== DARK / LIGHT MODE =====
let isLightMode = false;

function toggleTheme() {
  isLightMode = !isLightMode;
  const btn = document.getElementById('themeToggle');
  if (isLightMode) {
    document.body.classList.add('light-mode');
    btn.textContent = '☀️';
    localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.remove('light-mode');
    btn.textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  }
}

// Remember theme on reload
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    isLightMode = true;
    document.body.classList.add('light-mode');
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = '☀️';
  }
});

// ===== SAVE THE DATE =====
function saveToCalendar() {
  const title = 'Shahan & Jannatara Wedding 💍';
  const location = 'Hill View Restaurant & Party Centre, Khadimpara, Sylhet';
  const details = 'You are cordially invited to the wedding celebration of Shahan Ahmed & Jannatara Afsana';
  const startDate = '20260515T080000Z';
  const endDate = '20260515T140000Z';

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  document.getElementById('googleCalLink').href = googleUrl;

  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=2026-05-15T14:00:00&enddt=2026-05-15T20:00:00&body=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  document.getElementById('outlookCalLink').href = outlookUrl;

  document.getElementById('calPopup').classList.add('show');
  document.getElementById('calOverlay').classList.add('show');
}

function closeCalendar() {
  document.getElementById('calPopup').classList.remove('show');
  document.getElementById('calOverlay').classList.remove('show');
}

function downloadICS() {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//EN
BEGIN:VEVENT
DTSTART:20260515T080000Z
DTEND:20260515T140000Z
SUMMARY:Shahan & Jannatara Wedding 💍
DESCRIPTION:You are cordially invited to the wedding celebration of Shahan Ahmed & Jannatara Afsana
LOCATION:Hill View Restaurant & Party Centre, Khadimpara, Sylhet
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Shahan-Jannatara-Wedding.ics';
  link.click();
  URL.revokeObjectURL(url);
}

// ===== DYNAMIC CLOSING PAGE =====
function updateClosingPage() {
  const weddingDate = new Date('2026-05-15T14:00:00');
  const now = new Date();

  const todayStr = now.toDateString();
  const weddingStr = weddingDate.toDateString();

  const beforeEl = document.getElementById('closingBefore');
  const todayEl  = document.getElementById('closingToday');
  const afterEl  = document.getElementById('closingAfter');

  if (!beforeEl) return;

  if (todayStr === weddingStr) {
    beforeEl.style.display = 'none';
    todayEl.style.display  = 'flex';
    afterEl.style.display  = 'none';

  } else if (now < weddingDate) {
    beforeEl.style.display = 'flex';
    todayEl.style.display  = 'none';
    afterEl.style.display  = 'none';

    const diff = weddingDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const el = document.getElementById('closingDaysLeft');
    if (days === 0)      el.textContent = '🎊 Tomorrow is the Special Day!';
    else if (days === 1) el.textContent = '✨ Just 1 day to go!';
    else                 el.textContent = `✨ Just ${days} days to go!`;

  } else {
    beforeEl.style.display = 'none';
    todayEl.style.display  = 'none';
    afterEl.style.display  = 'flex';

    const diff = now - weddingDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const el = document.getElementById('closingDaysSince');
    if (days === 0)      el.textContent = '💍 Today is our wedding day!';
    else if (days === 1) el.textContent = '💕 1 day of our beautiful marriage!';
    else                 el.textContent = `💕 ${days} days of our beautiful marriage!`;
  }
}

updateClosingPage();
setInterval(updateClosingPage, 60000);