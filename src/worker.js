// API 키는 Worker 비밀값(env.SEOUL_API_KEY)으로만 사용하며 브라우저로 전달하지 않는다.
const BASE = "http://openapi.seoul.go.kr:8088";
const SERVICE = "tbLnOpendataRentV";
const PAGE = 1000;
const MAX_PAGES = 40; // Worker 하위 요청 한도 안에서 동 하나(2026년)에 충분한 양
const YEAR = "2026";
const USAGES = ["아파트", "연립다세대", "단독다가구", "오피스텔"];

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": status === 200 ? "public, max-age=3600" : "no-store" },
  });

async function page(env, start, end, cgg, stdg, usg) {
  // 서울시 OpenAPI 필터는 경로의 위치 인자: 접수연도/자치구코드/자치구명/법정동코드/지번구분/본번/부번/계약일/건물명/건물용도
  const parts = [YEAR, cgg, "", stdg, "", "", "", "", "", usg].map(encodeURIComponent).join("/");
  const url = `${BASE}/${encodeURIComponent(env.SEOUL_API_KEY)}/json/${SERVICE}/${start}/${end}/${parts}`;
  let res;
  try { res = await fetch(url); } catch { throw new Error("서울시 OpenAPI에 연결할 수 없습니다."); }
  if (!res.ok) throw new Error(`서울시 OpenAPI HTTP ${res.status}`);
  let data;
  try { data = await res.json(); } catch { throw new Error("서울시 OpenAPI 응답이 JSON이 아닙니다."); }
  const svc = data[SERVICE];
  if (!svc) throw new Error(`서울시 OpenAPI 오류: ${data?.RESULT?.CODE ?? "UNKNOWN"}`);
  const code = svc.RESULT?.CODE;
  if (code === "INFO-200") return { total: 0, rows: [] };
  if (code !== "INFO-000") throw new Error(`서울시 OpenAPI 오류: ${code}`); // 요청 URL(키 포함)은 절대 출력하지 않는다
  return { total: Number(svc.list_total_count) || 0, rows: svc.row ?? [] };
}

async function fetchAll(env, cgg, stdg, usg) {
  const first = await page(env, 1, PAGE, cgg, stdg, usg);
  const rows = [...first.rows];
  const pages = Math.min(Math.ceil(first.total / PAGE), MAX_PAGES);
  for (let i = 1; i < pages; i++) {
    rows.push(...(await page(env, i * PAGE + 1, (i + 1) * PAGE, cgg, stdg, usg)).rows);
  }
  return { total: first.total, rows };
}

async function rent(env, url) {
  const cgg = url.searchParams.get("cgg") ?? "";
  const stdg = url.searchParams.get("stdg") ?? "";
  const usg = url.searchParams.get("usg") ?? "";
  if (!/^\d{5}$/.test(cgg) || !/^\d{5}$/.test(stdg) || !USAGES.includes(usg)) return json({ error: "잘못된 요청입니다." }, 400);
  if (!env.SEOUL_API_KEY) return json({ error: "서버에 API 키가 설정되지 않았습니다." }, 500);
  try {
    const { total, rows } = await fetchAll(env, cgg, stdg, usg);
    const jeonse = rows.filter(r => r.RENT_SE === "전세" && Number(r.GRFE) >= 0);
    const sum = jeonse.reduce((s, r) => s + Number(r.GRFE), 0);
    return json({
      year: YEAR,
      fetched: rows.length,
      truncated: rows.length < total,
      count: jeonse.length,
      average: jeonse.length ? sum / jeonse.length : null,
      rows: jeonse.map(r => ({
        date: r.CTRT_DAY, name: r.BLDG_NM, floor: r.FLR, area: Number(r.RENT_AREA), deposit: Number(r.GRFE),
      })).sort((a, b) => String(b.date).localeCompare(String(a.date))),
    });
  } catch (e) {
    return json({ error: e.message }, 502);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/rent") return rent(env, url);
    return env.ASSETS.fetch(request);
  },
};
