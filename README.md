# 서울 전세가 평균 앱 (과제 2)

자치구·행정동·주택유형을 고르면 평균 전세가를 알려주는 앱입니다. 하나의 Cloudflare Worker에 두 버전이 함께 배포됩니다.

배포 주소: https://my-app-2.chiho-kang.workers.dev (옵션 2: `/live/`)

| 경로 | 옵션 | 데이터 |
| --- | --- | --- |
| `/` | 옵션 1 | 전처리된 `public/data/jeonse_mean.csv` |
| `/live/` | 옵션 2 | 서울 열린데이터광장 OpenAPI(`tbLnOpendataRentV`)에서 선택한 동의 2026년 전세 계약을 실시간 조회 |

## 파일
- `public/index.html`: 옵션 1 (외부 라이브러리 없음)
- `public/live/index.html`: 옵션 2 화면
- `public/dongs.json`: 자치구·법정동 코드 목록 (API 조회용)
- `src/worker.js`: `/api/rent` — 서울시 API를 대신 호출하는 Worker
- `wrangler.jsonc`: Cloudflare 설정

## API 키 보안
- 브라우저는 `/api/rent`만 호출하고, 서울시 API는 Worker가 호출합니다. 키는 브라우저로 전달되지 않습니다.
- 키는 저장소에 없습니다. 로컬은 `.dev.vars`(Git 제외), 배포는 Cloudflare Secret입니다. 오류 메시지에도 요청 URL을 넣지 않습니다.

## 로컬 실행
```sh
cp .env.example .dev.vars   # SEOUL_API_KEY=발급받은키 입력
npx wrangler dev
```

## Cloudflare 배포
1. Workers & Pages → Import a repository로 이 저장소(`main`)를 연결합니다. Build command는 비우고 Deploy command는 `npx wrangler deploy`입니다.
2. 배포된 Worker → Settings → Variables and Secrets에서 **Secret** `SEOUL_API_KEY`를 추가합니다. (옵션 2에만 필요)
