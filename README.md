# 🍀 숨쉴 취미.zip

학기 중 스트레스와 번아웃을 겪는 대학생들을 위해 **학기용 취미**를 소개하고, 성향에 맞는 취미를 추천하는 웹사이트입니다.

## 📌 프로젝트 소개

대학생들은 시험, 과제, 팀 프로젝트 등으로 인해 많은 스트레스를 경험합니다.

"숨쉴 취미.zip"은 학기 중에도 부담 없이 시작할 수 있는 취미를 소개하고, 5명의 팀원이 직접 경험한 취미와 설문·게임을 통해 사용자에게 맞는 취미를 추천하여 건강한 대학생활을 돕기 위해 제작되었습니다.

---

## 🎯 주요 기능

### 1. 메인 페이지

* 대학생들이 겪는 스트레스 상황 소개
* 일반 취미 vs **학기용 취미** 비교
* 취미의 장점·사용자 여정 안내
* 팀원 추천 취미 미리보기 (카드 클릭 시 가이드·팁 모달)
* **「내 취미 찾으러 가기」** → 설문 페이지 연결

### 2. 팀원 소개 페이지

* 팀원 정보·역할·수행 업무 소개
* 각 팀원이 추천하는 취미 카드 (클릭 시 가이드·팁·사진 모달)

### 3. 취미도감

* `hobbies.json`에 등록된 **41개 취미** 전체 탐색
* **전체 / 학기 추천 / 팀 추천** 필터
* 카드 뱃지: **★학기 추천 점수**, **팀** (팀원 소개 취미)
* 카드 클릭 시 시작 가이드·학기 중 꿀팁 모달
* 데스크톱 5열 그리드 (태블릿 3열 · 모바일 2열)

### 4. 이모티콘 취미 퀴즈 게임

* 이모티콘 조합을 보고 취미 맞추기
* 총 7라운드 진행
* 정답 시 점수 획득

### 5. 취미 추천 설문

* 5문항: 스트레스 정도, 가능 시간, 기분, 실내/실외, 혼자/함께
* **1차 추천**: 가중치 기반 팀원 취미 묶음 매칭
* **2차 추천**: 태그·학기 점수 기반 추가 취미 3개 (`이런 취미는 어때요?`)
* 결과 카드 클릭 시 가이드·팁·학기 점수·팀 추천 여부 모달

---

## 🛠 사용 기술

### Front-End

* HTML5
* CSS3
* JavaScript (ES Modules)

### Deployment

* Vercel

---

## 📂 프로젝트 구조

```text
project/
├── pages/              # 화면(도메인)별
│   ├── main/
│   ├── team/
│   ├── hobbies/        # 취미도감
│   │   ├── hobbies.html
│   │   ├── hobbies.js
│   │   └── hobby-ui.js # 카드 뱃지·모달 메타 (폼 2차 추천과 공유)
│   ├── game/
│   └── form/
│       ├── form.html
│       ├── form.js
│       └── form-ui.js  # 진행률·칩 선택 UI
├── assets/
│   ├── style.css       # 공통 스타일
│   └── images/         # 팀원·취미 사진
├── shared/
│   ├── layout.js       # 공통 nav·footer
│   └── data/
│       ├── hobbies.json   # 취미 마스터 (41개, tags·semester·guide·tip)
│       ├── members.json   # 팀원 (hobbyIds, teamGuide, teamTip)
│       ├── form.json      # 1차 추천 묶음·가중치·2차 추천 설정
│       ├── game.json      # 게임 라운드·설정
│       └── data.js        # JSON fetch·조인·2차 추천 스코어링 (ES module)
├── docs/
│   └── wireframe.html
└── vercel.json
```

### 데이터 구조 요약

| 파일 | 역할 |
|------|------|
| `hobbies.json` | 취미 단일 엔티티 (`id`, `name`, `emoji`, `tags`, `semester.score`, `guide`, `tip`) |
| `members.json` | 팀원 + `hobbyIds[]`로 취미 연결, 팀 소개용 `teamGuide` / `teamTip` |
| `form.json` | 5팀 1차 추천 묶음, 설문 옵션·가중치, 2차 추천(`secondary`) 설정 |
| `data.js` | `fetchContent` · `fetchForm` · `fetchCatalog` · `fetchGame` 및 조합 헬퍼 |

---

## 🧭 페이지 경로

| 페이지 | 경로 |
|--------|------|
| 메인 | `/pages/main/main.html` |
| 팀원 소개 | `/pages/team/team.html` |
| 취미도감 | `/pages/hobbies/hobbies.html` |
| 게임 | `/pages/game/game.html` |
| 설문 | `/pages/form/form.html` |

Vercel 배포 시 `/hobbies.html` 등 짧은 경로로도 접근 가능 (`vercel.json` rewrite).

---

## 👨‍💻 팀원 소개

| 이름 | 역할 |
|------|------|
| 김시연 | 발표 자료 구성·제작, 폼 카드·버튼, 메인 취미 장점 카드 |
| 유가영 | 메인·폼 페이지 구현, 설문 UI·가중치 매칭 알고리즘 |
| 장범조 | 페이지 구현 |
| 정호진 | UI/UX·디자인 시스템, 공통 레이아웃·데이터 구조, 취미도감·2차 추천·페이지 연동 |
| 최종은 | 기획 리드, 페르소나·사용자 여정, 최종 발표 |

---

## 💡 기대 효과

* 대학생 스트레스 완화
* 학기 중에도 실천 가능한 취미 발견
* 설문·게임·취미도감을 통한 다양한 탐색 경험
* 쉽고 재미있는 웹 서비스 경험 제공

---

## 🚀 실행 방법

1. 프로젝트 다운로드
2. 로컬 서버 실행 후 접속 (예: `npx serve .`)
   * 메인: `/pages/main/main.html` 또는 `/`
3. 또는 배포된 웹사이트 접속: [https://files-mu-liard.vercel.app/](https://files-mu-liard.vercel.app/)

> ES Module(`import`)을 사용하므로 `file://`로 직접 열면 동작하지 않을 수 있습니다. 반드시 로컬 서버를 사용하세요.

---

## 📅 개발 기간

2026년 1학기 웹클라이언트컴퓨팅 프로젝트

---

© 2026 숨쉴 취미.zip · 웹클라이언트컴퓨팅 01분반
