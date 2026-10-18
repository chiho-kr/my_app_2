/* Plotly figures exported directly from the assignment notebook. */
(function () {
  'use strict';
  const charts = [
    ['trend-chart', window.JEONSE_CHARTS.trend],
    ['change-chart', window.JEONSE_CHARTS.change]
  ];
  const config = {responsive: true, displaylogo: false, scrollZoom: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    toImageButtonOptions: {format: 'png', scale: 2}};
  const isMobile = () => window.innerWidth <= 700;
  charts.forEach(([id, figure]) => {
    const layout = {...figure.layout, autosize: true};
    delete layout.width;
    if (isMobile()) {
      layout.title = {...layout.title, font: {...layout.title.font, size: 15}};
      layout.margin = {l: 48, r: 18, t: 105, b: 100};
      layout.height = 450;
      layout.font = {...layout.font, size: 10};
      layout.annotations = (layout.annotations || []).map(a => ({...a,
        font: {...a.font, size: a.xref === 'paper' ? 8 : 10}}));
      layout.title.text = id === 'trend-chart'
        ? '<b>서울 전세, 하락 이후 회복 중</b><br><sup>2021~2025 · 서울 아파트 · 2021.6=100</sup>'
        : '<b>급락 이후 2년 연속 반등</b><br><sup>전년 대비 변화율 · 서울 아파트</sup>';
      layout.annotations = layout.annotations.map(a => a.xref === 'paper'
        ? {...a, text: '자료: 한국부동산원 / 국가지표체계' +
          (id === 'trend-chart' ? '<br>변화를 보기 위해 세로축은 80부터 표시' : '')}
        : a);
    }
    Plotly.newPlot(id, figure.data, layout, config).catch(() => {
      document.getElementById(id).textContent = '그래프를 불러오지 못했습니다. 아래 표에서 데이터를 확인해 주세요.';
    });
  });
})();
