// ===== PAGE 1 — Tap to Open =====
const tapBtn = document.getElementById('tapBtn');

tapBtn.addEventListener('click', function () {
  document.querySelector('.left-curtain').classList.add('open');
  document.querySelector('.right-curtain').classList.add('open');

  tapBtn.style.opacity = '0';
  tapBtn.style.pointerEvents = 'none';

  setTimeout(() => {
    goToPage('page-2');

    // Small delay so page is visible BEFORE curtains open
    setTimeout(() => {
      openPage2Curtains();
    }, 100);

  }, 1300);
});

// ===== PAGE SWITCHER =====
function goToPage(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  const target = document.getElementById(pageId);
  target.style.display = 'flex';
  target.classList.add('active');
}

// ===== PAGE 2 — Open Curtains =====
function openPage2Curtains() {
  // Reset curtains to closed position first
  document.querySelector('.top-curtain').classList.remove('open2');
  document.querySelector('.bottom-curtain').classList.remove('open2');
  document.querySelector('.reveal-center').classList.remove('show');

  setTimeout(() => {
    document.querySelector('.top-curtain').classList.add('open2');
    document.querySelector('.bottom-curtain').classList.add('open2');

    setTimeout(() => {
      document.querySelector('.reveal-center').classList.add('show');
    }, 800);

  }, 200);

  // After reveal → go to Page 3 (coming soon)
  setTimeout(() => {
    goToPage('page-3');
  }, 4000);
}