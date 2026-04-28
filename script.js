function goToPage(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  const target = document.getElementById(pageId);
  target.style.display = 'flex';
  target.classList.add('active');
}

// ===== AUTO GO TO PAGE 3 AFTER PAGE 2 =====
setTimeout(() => {
  // This runs after page 2 names appear
}, 0);

const tapBtn = document.getElementById('tapBtn');

tapBtn.addEventListener('click', function () {
  document.querySelector('.left-curtain').classList.add('open');
  document.querySelector('.right-curtain').classList.add('open');
  tapBtn.style.opacity = '0';
  tapBtn.style.pointerEvents = 'none';

  setTimeout(() => {
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });

    const page2 = document.getElementById('page-2');
    page2.style.display = 'flex';
    page2.classList.add('active');

    setTimeout(() => {
      document.querySelector('.reveal-center').classList.add('show');
    }, 700);

    // Page 2 is complete; do not auto-navigate away.
    // Remove or change the code below if you add a next page later.
    // setTimeout(() => {
    //   goToPage('page-3');
    // }, 3000);

  }, 1300);
});