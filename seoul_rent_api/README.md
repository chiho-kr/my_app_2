# 서울 전세가 평균 – OpenAPI (옵션 2)

자치구·행정동·주택유형을 고르면 서울 열린데이터광장 `tbLnOpendataRentV` API에서 해당 동의 2026년 전세 계약을 모두 가져와 평균을 계산합니다.

## API 키 보안
- 키는 브라우저에 보내지 않습니다. 브라우저는 `/api/rent`만 호출하고, 서울시 API 호출은 Cloudflare Worker(`src/worker.js`)가 합니다.
- 키는 코드나 저장소에 없습니다. 로컬은 `.dev.vars`(Git 제외), 배포는 Cloudflare 비밀값으로 저장합니다.
- 오류 메시지에는 요청 URL을 넣지 않습니다.

## 로컬 실행
```sh
cp .env.example .dev.vars   # SEOUL_API_KEY=발급받은키 입력
npx wrangler dev
```

## Cloudflare 배포
1. Workers & Pages → Import a repository로 이 저장소(`main`) 연결 (Deploy command: `npx wrangler deploy`)
2. 배포된 Worker → Settings → Variables and Secrets → Add → 유형 **Secret**, 이름 `SEOUL_API_KEY`, 값 입력 → Deploy
