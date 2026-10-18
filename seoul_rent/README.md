# 서울 전세가 평균 (옵션 1)

`jeonse_mean.csv`(동별·주택유형별 평균 전세가)로 자치구·행정동·주택유형을 고르면 평균 전세가를 보여주는 정적 웹앱입니다.

- `public/index.html`: 앱 (외부 라이브러리 없음)
- `public/data/jeonse_mean.csv`: 전처리된 데이터
- `wrangler.jsonc`: Cloudflare Workers 정적 자산 배포 설정 (`public` 폴더)

## 로컬 실행
```sh
python3 -m http.server 8000 --directory public
```

## Cloudflare 배포
Workers & Pages → Import a repository로 이 저장소(`main`)를 연결합니다. Build command는 비우고 Deploy command는 `npx wrangler deploy`입니다.
