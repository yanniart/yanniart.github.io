// =========================================
// 공통 동작 (모든 페이지)
// 페이지가 열리면 .reveal 요소가 순서대로 나타나요.
// 순서는 HTML에 적힌 차례대로예요.
// =========================================

const revealItems = document.querySelectorAll('.reveal');

revealItems.forEach((el, i) => el.style.setProperty('--i', i));

// 숨겨진 처음 상태를 한 번 그린 다음에 효과 시작
document.body.getBoundingClientRect();
revealItems.forEach((el) => el.classList.add('is-visible'));
