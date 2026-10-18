# 서울 전세, 5년의 흐름

**과제 2. 지난 5년간 서울시 전세 가격 변화를 분석하시오.**

2021~2025년 서울 아파트 전세가격지수를 표와 인터랙티브 Plotly 그래프로 분석했습니다. 수업 노트북에서 과제 부분만 추출했으며, 두 그래프의 색상과 강조 표시를 그대로 사용합니다.

- GitHub 저장소: https://github.com/chiho-kr/my_app_2

## 구성

- `analysis.ipynb`: 과제에 해당하는 설명, Python 코드, 실행 결과
- `generate.py`: 노트북의 그래프를 정적 웹페이지용 파일로 내보내는 코드
- `dist/`: Cloudflare Pages에 배포하는 완성된 웹페이지
- `dist/data/seoul-jeonse.csv`: 분석 데이터
- `requirements.txt`: 분석 및 내보내기에 필요한 Python 패키지

## 로컬 확인

프로젝트 폴더에서 다음을 실행한 후 `http://localhost:8000`에 접속합니다.

```sh
python -m http.server 8000 --directory dist
```

웹페이지 실행에는 Python 분석 패키지나 별도 빌드가 필요하지 않습니다. Plotly.js도 함께 포함되어 외부 CDN 없이 그래프를 표시합니다.

## 분석 코드 실행

```sh
python -m pip install -r requirements.txt
```

VS Code의 Jupyter Notebook 편집기에서 `analysis.ipynb`를 열고 코드 셀을 위에서부터 실행합니다. `generate.py`를 실행하면 노트북의 현재 코드에서 웹용 그래프와 데이터를 다시 생성합니다.

```sh
python generate.py
```

## Cloudflare 배포

Cloudflare Workers의 정적 자산 호스팅을 사용합니다. `wrangler.jsonc`가 `dist` 폴더를 배포하도록 설정합니다.

Cloudflare 대시보드에서 Workers & Pages → Import a repository로 이 저장소(`main`)를 연결하면 push할 때마다 자동 배포됩니다. 빌드 명령은 비우고, 배포 명령은 `npx wrangler deploy`를 사용합니다.

직접 배포하려면 다음을 실행합니다.

```sh
npx wrangler login
npx wrangler deploy
```

## 자료와 해석

출처: 한국부동산원 전국주택가격동향조사, [국가지표체계 「주택유형별 주택 전세가격 지수」](https://www.index.go.kr/unity/potal/eNara/sub/showStblGams3.do?freq=Y&idx_cd=F0183&period=N&stts_cd=F018301).

서울 아파트 전세가격지수의 연간 값을 사용했습니다. 기준은 2021년 6월=100이며, 계약별 평균 보증금과는 다른 지표입니다. 변화율은 `(당해 지수 / 전년 지수 - 1) * 100`으로 계산했습니다. 2021년에는 비교할 전년 값을 입력하지 않았습니다.

서울 아파트 이외의 주택유형을 포함하지 않으며, 연간 지수만으로 변동 원인을 확정하지 않습니다.
