// =========================================
// 공통 동작
// 1) 섹션이 화면에 들어오면 그 안의 .reveal 요소가 순서대로 나타나요.
// 2) 지금 보고 있는 섹션의 메뉴 글자를 포인트 색으로 바꿔요.
// =========================================

const sections = document.querySelectorAll('.screen');
const navLinks = document.querySelectorAll('.site-nav a');

// 섹션마다 순서(--i)를 0부터 다시 매겨요 (HTML에 적힌 차례대로)
sections.forEach((section) => {
  section.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--i', i));
});

const showSection = (section) => {
  section.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
};

if ('IntersectionObserver' in window) {
  // 1) 나타나는 효과: 섹션이 15% 정도 보이면 시작 (한 번만)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      showSection(entry.target);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  // 2) 메뉴 표시: 화면 가운데 선에 걸친 섹션이 '지금 섹션'
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => {
        if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach((section) => {
    revealObserver.observe(section);
    navObserver.observe(section);
  });
} else {
  sections.forEach(showSection);
}
