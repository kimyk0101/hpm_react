# 🏔️ 하이등산 (HPMountain) – 등산 큐레이션 플랫폼

> 하이펜타M 팀이 개발한 **하이킹 추천 및 커뮤니티 플랫폼**  
> 산 정보 큐레이션부터 커뮤니티, 날씨, 채팅, 지도 기반 시각화 등 다양한 기능을 통합한 웹 서비스입니다.

---

## 팀 정보

- 팀명: **하이펜타M**
  - 의미: 하이(HI: 높은, 안녕) + 펜타(5명) + M(Mountain)
- 팀원: 총 5명
- 기간: **2025.03.24 ~ 2025.04.16 (24일)**

---

## 기획 의도

- 등산 초보자도 쉽게 접근할 수 있도록 산 추천/검색 기능 제공
- 날씨, 위치, 코스 정보, 커뮤니티 후기를 통합해 **개인화된 등산 경험** 제공
- S3 이미지 업로드, 실시간 채팅, 지도 클러스터링 등 최신 기술 경험
- 등산 관련 커뮤니티 활성화 및 유저 간 소통 기능 강화

---

## 🛠사용 기술

| 구분 | 기술 |
|------|------|
| Frontend | React, JSX, CSS, Nginx |
| Backend | Spring Boot, Java, MyBatis |
| API | OpenWeather API, 공공데이터 산림청 산정보 API |
| 지도 | Kakao Map API (마커 클러스터링 포함) |
| 이미지 저장 | AWS S3 |
| 실시간 채팅 | Sendbird |
| 배포 | Docker, Nginx, AWS EC2 |
| 기타 | .env 설정 분리, Shell Script 자동화, RESTful API 구성 |

---

## 주요 기능

### 사용자 및 인증
- 회원가입 (프로필 이미지 업로드, 주소 검색)
- 로그인 / 로그아웃
- 로그인 여부에 따른 권한 제어 (글쓰기, 채팅 등)

### 등산 정보
- 산 목록 및 상세 조회 (위치/높이/소요시간 등)
- 코스별 난이도 / 거리 / 시간 정보
- 날씨 API 연동 (해당 산 위치 기준 실시간 날씨 제공)
- 지도 기반 클러스터링 (Kakao Maps API)

### 추천 시스템
- 지역, 소요시간, 난이도 등 필터 기준 산 추천
- DB 기반 알고리즘 구현

### 커뮤니티
- 게시글 CRUD + 댓글/대댓글 + 좋아요(하트) 기능
- 인스타그램 스타일 UI
- S3 이미지 업로드
- 게시글 신고 시 관리자 페이지에서 색상 진하게 표시

### 리뷰 / 맛집
- 산별 후기를 등록할 수 있는 리뷰 기능
- 등산 후 인근 맛집 등록 및 후기 작성 가능

### 채팅
- 모임 기반 채팅 기능
- Sendbird 활용 (1:1 채팅 인터페이스 구현)
- 로그인 필수, 채팅목록 + 대화 UI 구현

---

## DB 구조 (요약)

총 20개 이상의 테이블로 구성 (일부 예시)

- `users`, `user_photos`
- `mountains`, `mountain_courses`, `mountain_images`, `mountain_photos`
- `reviews`, `review_comments`, `review_likes`, `review_photos`
- `restaurants`, `restaurant_comments`, `restaurant_likes`, `restaurant_photos`
- `communities`, `community_comments`, `community_photos`
- `clubs`, `club_comments`

> [✔] 전체 DB 구조는 `최종프로젝트 최종DB.sql` 파일 참조
> [✔] 등산 코스는 'mountain_courses.txt' 파일 참조

---

## 대표 이미지

![대표이미지](./public/result-image/MainHeaderImage.jpg)

---

## 배포

- Dockerfile + Nginx 기반 2단계 Multi-stage 빌드
- AWS EC2 서버 배포
- `.env`, `.production`, `.bat/.sh` 자동화 파일 관리
- React + Spring Boot 컨테이너 각각 구성

---

## 미구현 기능 및 한계

- 비밀번호 암호화 미적용
- 아이디/비밀번호 찾기 기능 미구현
- 관리자 계정 기능 일부만 구현 (신고 감지 → 색상 표시까지만)
- 알림(Notification) 기능 미구현
- 채팅 WebSocket 미적용 (Sendbird 외부 라이브러리 활용)

---

## 폴더 구조 (간략)

```
├── public/
│   └── result-image/, icons/, images/
├── src/
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   ├── data/
│   ├── styles/
│   └── utils/
├── spring/
│   ├── controller/
│   ├── service/
│   ├── mappers/
│   ├── vo/
│   ├── resources/
│   └── application.properties
├── Dockerfile
└── nginx/
```

---

## 회고

> React, Spring Boot, MySQL, Docker, S3 등 실무에서 자주 사용되는 스택을 활용하여 **전체 서비스를 기획부터 배포까지 주도적으로 경험**할 수 있었던 프로젝트입니다.  
> 실시간 기능 구현, 지도 기반 시각화, 이미지 업로드, 외부 API 활용 등 다양한 기능을 팀원과 분업하며 **완성도 높은 협업** 경험을 쌓았습니다.
