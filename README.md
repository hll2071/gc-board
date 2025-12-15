# 이미지 갤러리 게시판 (GC Board 개선판)

> **배포 URL**: [배포된 서비스 URL 입력]

## 📌 프로젝트 소개
이 프로젝트는 기존 GC Board의 아쉬운 점을 개선하여 프리미엄 **이미지 갤러리 게시판**으로 재탄생시킨 결과물입니다. 시각적인 경험과 견고한 백엔드 아키텍처에 중점을 두었습니다.

- **개발 기간**: 2025.12.01 ~ 2025.12.18
- **개발자**: 황성민

---

## 🔍 개선 사항

### 진단 및 해결 방안

| 기존 코드의 문제점 | 개선 방법 |
|-------------------|----------|
| **일관성 없는 예외 처리** | `@ControllerAdvice`를 활용한 **전역 예외 처리(Global Exception Handling)**를 구현하여, 500 에러 대신 명확한 JSON 에러 응답(4xx, 5xx)을 제공합니다. |
| **제한적인 페이지네이션** | 기존의 오프셋 방식 대신 **커서 기반 무한 스크롤(Cursor-based Infinite Scroll)**을 도입하여, 피드 형태의 끊김 없는 사용자 경험을 제공합니다. |
| **단순한 댓글 구조** | **경로 열거 모델(Path Enumeration Model)**을 사용하여 무한 대댓글이 가능한 **계층형 댓글(N-Depth)** 구조로 업그레이드했습니다. |

### 개선 결과

**1. 전역 예외 처리**
- **개선 전**: `orElseThrow()`로 인해 스택 트레이스가 포함된 500 내부 서버 오류 발생.
- **개선 후**: `ArticleNotFoundException` 등 커스텀 예외를 통해 404 Not Found와 명확한 메시지 반환: `{"code": "ARTICLE_NOT_FOUND", "message": "게시글을 찾을 수 없습니다."}`.

**2. 무한 스크롤**
- **개선 전**: 페이지 번호(1, 2, 3...)를 클릭하여 이동하는 방식.
- **개선 후**: 스크롤을 내리면 `lastId` 커서를 이용해 자동으로 다음 이미지를 로드.

---

## ✨ 주요 기능

### 1. 이미지 갤러리
- **Masonry/Grid 레이아웃**: 아름다운 이미지 배치.
- **무한 스크롤**: 끊김 없는 콘텐츠 로딩.

### 2. 계층형 댓글
- **대댓글 시스템**: 어떤 댓글에도 답글 작성 가능.
- **재귀적 삭제**: 부모 댓글 삭제 시 논리적 삭제(Soft Delete) 처리되며, 모든 자식 댓글이 삭제되면 물리적으로 완전히 삭제(Hard Delete)됨.

---

## 🛠️ 기술 스택

### Backend
- Java 17, Spring Boot 3.3.2
- Spring Data JPA, H2/MySQL
- **핵심 기술**: 커서 기반 페이지네이션, 경로 열거 모델(Path Enumeration Model)

### Frontend
- HTML5, CSS3 (프리미엄 다크 모드)
- Vanilla JavaScript (ES6+)

---

## 🔗 API 명세

### 게시글 (Articles)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles?lastId={id}&size={size}` | 게시글 목록 조회 (무한 스크롤) |
| POST | `/api/articles` | 게시글 작성 |

### 댓글 (Comments)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles/{articleId}/comments` | 댓글 목록 조회 |
| POST | `/api/comments` | 댓글 작성 |
| DELETE | `/api/comments/{id}` | 댓글 삭제 |

---

## 💻 로컬 실행 방법

```bash
# 1. 클론
git clone https://github.com/hll2071/gc-board.git

# 2. 백엔드 실행
./gradlew bootRun

# 3. 접속
open http://localhost:8080
```
