# my_app_2 – 서울 전세가 평균 앱

과제 2. 동별/주택유형별 전세가 평균 확인 앱. 한 저장소에 두 앱이 있고, 각각 별도의 Cloudflare Worker로 배포합니다.

| 폴더 | 내용 |
| --- | --- |
| [`seoul_rent/`](seoul_rent) | 옵션 1: 전처리된 `jeonse_mean.csv` 사용 (정적 앱) |
| [`seoul_rent_api/`](seoul_rent_api) | 옵션 2: 서울 열린데이터광장 API 사용 (Worker가 API 키를 보관) |

## Cloudflare 배포
Workers & Pages → Import a repository에서 이 저장소를 **앱마다 한 번씩** 연결합니다.

| | Project name | Root directory | Deploy command |
| --- | --- | --- | --- |
| 옵션 1 | `seoul-rent` | `seoul_rent` | `npx wrangler deploy` |
| 옵션 2 | `seoul-rent-api` | `seoul_rent_api` | `npx wrangler deploy` |

Build command는 비워 둡니다. 옵션 2는 배포 후 Worker → Settings → Variables and Secrets에서 Secret `SEOUL_API_KEY`를 추가합니다.
