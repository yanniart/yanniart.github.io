# 개발 기록

## 2026-11-19 · 한 페이지 스크롤 구조로 변경 (브랜치 `feature/one-page-scroll`)

### 결정 사항
- 5개 페이지를 `index.html` 한 장에 섹션으로 합침: `#home` → `#about` → `#work` → `#skill` → `#contact`
  - 섹션 = `<section class="screen" id="...">` 안에 기존 Canva 슬라이드 `<div class="slide">`
  - PC(768px 이상)는 섹션마다 화면 한 장 높이, 슬라이드를 가운데 배치
- 상단 메뉴: `About / Work / Skill / Contact`를 오른쪽 위에 고정(`.site-header`, `position: fixed`)
  - 지금 보고 있는 섹션 메뉴는 포인트 색 (`js/main.js`, IntersectionObserver)
  - 기존 가운데 메뉴(.top-nav)와 H/A/W/S/C 미니 메뉴(.mini-nav)는 삭제
- 섹션별 CSS 파일(`css/page-*.css`)은 그대로 두고 선택자 앞에 `:where(#섹션id)`를 붙임
  - `:where()`는 점수(우선순위)를 0으로 만들어서, 예전 페이지별 CSS와 같은 우선순위로 동작해요.
    `#about .x`처럼 쓰면 휴대폰용 `width`가 PC 배치를 덮어써서 화면이 깨져요.
- 제목 단계: 페이지 전체에 h1은 Home 제목 하나, 섹션 제목은 h2, 카드/박스 제목은 h3
- ~~`about.html` 등 예전 주소 4개는 `index.html#섹션`으로 자동 이동하는 파일로 남김~~
  → 2026-11-19 변경: 사이트 안에서 쓰이지 않아 삭제하기로 함 (사용자가 직접 삭제)
- Skill 섹션의 빨간 점선 장식은 고정 메뉴와 겹쳐서 왼쪽으로 조금 옮김 (x 1013.9→985, y 19.1→24)

### 확인 결과
- PC 1366×768, 모바일 375×812에서 섹션 5개 모두 표시, 가로 스크롤 없음, 메뉴 강조 정상

### 다음 작업
현재 상태: 한 페이지 구조 작업 완료, 브랜치 `feature/one-page-scroll`에 **커밋 전** (13개 파일 수정 + `docs/` 새로 생김)

- [ ] 실제 브라우저에서 메뉴 클릭 → 부드러운 스크롤 직접 확인
  - 실행: `python -m http.server 5500` → `http://localhost:5500/` (`.claude/launch.json`에 설정 있음)
  - 부드러운 스크롤은 `css/base.css`의 `html { scroll-behavior: smooth; scroll-padding-top: var(--header-h); }`
- [ ] 태블릿 폭(768 / 900 / 1024px)에서 Skill 섹션 점선 장식이 메뉴와 겹치는지 확인
  - 겹치면 `css/page-skill.css` 36번째 줄 `.deco-dashes`의 `--x`(지금 985)를 더 줄이기
  - 참고: 헤드리스 Chrome 자동 스크린샷은 Claude Code 권한 설정에서 막혀 있음 → 직접 확인하거나 권한 허용 필요
- [ ] `about.html`, `work.html`, `skill.html`, `contact.html` 삭제 (사용자가 직접)
- [ ] 확인 끝나면 브랜치에 커밋 (요청 시)
- [ ] main 반영·배포 (요청 시)

## 2026-11-19 · 안 쓰는 파일 검토

### 결과
- 지울 것: 예전 주소용 HTML 4개뿐 (위 결정 참고)
- 그대로 둘 것 (모두 사용 중): CSS 클래스·변수, 글꼴 3개, `images/deco/` 장식 11개, 사진 3개
  - `box-frame.svg`는 HTML이 아니라 `css/page-skill.css`에서 씀 → 지우면 안 됨
- 섹션별 CSS 5개(`page-*.css`)는 합치지 않고 유지 (섹션별로 찾아 고치기 편함)
