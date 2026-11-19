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

// =========================================
// Work 구역: 탭 전환 + ◀▶ 버튼으로 카드 넘기기
// =========================================
const workTabs = [...document.querySelectorAll('#work [role="tab"]')];
const prevBtn = document.querySelector('#work .work-prev');
const nextBtn = document.querySelector('#work .work-next');

const activeTrack = () => document.querySelector('#work .work-track:not([hidden])');

// 맨 앞이면 ◀, 맨 끝이면 ▶를 숨겨요 (CSS: button:disabled)
// 카드 폭이 소수점이라 끝까지 가도 몇 px 모자랄 수 있어서 4px 여유를 둬요.
const EDGE = 4;
const updateArrows = () => {
  const track = activeTrack();
  if (!track || !prevBtn) return;
  const max = track.scrollWidth - track.clientWidth;
  const atStart = track.scrollLeft <= EDGE;
  const atEnd = track.scrollLeft >= max - EDGE;
  // 누르던 버튼이 사라지면 키보드 위치를 카드 줄로 옮겨요
  if ((atStart && document.activeElement === prevBtn) || (atEnd && document.activeElement === nextBtn)) track.focus();
  prevBtn.disabled = atStart;
  nextBtn.disabled = atEnd;
};

const selectTab = (tab) => {
  workTabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
  activeTrack().scrollLeft = 0;
  updateArrows();
};

workTabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectTab(tab));
  // 키보드 ←/→ 로 탭 이동
  tab.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = workTabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + workTabs.length) % workTabs.length];
    next.focus();
    selectTab(next);
  });
});

// 카드 한 장(+간격)만큼 넘기기
const scrollCards = (dir) => {
  const track = activeTrack();
  const card = track.querySelector('.work-card');
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  track.scrollBy({ left: dir * (card.offsetWidth + gap) });
};

if (prevBtn) {
  prevBtn.addEventListener('click', () => scrollCards(-1));
  nextBtn.addEventListener('click', () => scrollCards(1));
  document.querySelectorAll('#work .work-track').forEach((t) => {
    t.addEventListener('scroll', updateArrows, { passive: true });
    t.addEventListener('scrollend', updateArrows);   // 부드러운 스크롤이 끝난 뒤 한 번 더 확인
  });
  window.addEventListener('resize', updateArrows);
  window.addEventListener('load', updateArrows);     // 글꼴·사진이 다 뜬 뒤 폭이 바뀔 수 있어서
  updateArrows();
}
