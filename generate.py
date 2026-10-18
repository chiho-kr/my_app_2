"""Export only the assignment's charts and data as static website assets."""
import json
from pathlib import Path

import plotly.io as pio
from plotly.offline import get_plotlyjs

ROOT = Path(__file__).resolve().parent
notebook = json.loads((ROOT / "analysis.ipynb").read_text(encoding="utf-8"))
assets = ROOT / "dist" / "assets"
data_dir = ROOT / "dist" / "data"
assets.mkdir(parents=True, exist_ok=True)
data_dir.mkdir(parents=True, exist_ok=True)
namespace = {}
figures = []
for cell in notebook["cells"]:
    if cell["cell_type"] != "code":
        continue
    source = "".join(cell["source"])
    exec(compile(source.replace("fig.show()", ""), "analysis.ipynb", "exec"), namespace)
    if "fig.show()" in source:
        figures.append(json.loads(pio.to_json(namespace["fig"])))
if len(figures) != 2:
    raise ValueError("Expected exactly two assignment charts.")
(assets / "plotly.min.js").write_text(get_plotlyjs(), encoding="utf-8")
(assets / "charts.js").write_text(
    "window.JEONSE_CHARTS = "
    + json.dumps(dict(zip(["trend", "change"], figures)), ensure_ascii=False)
    + ";\n", encoding="utf-8"
)
namespace["jeonse"].to_csv(data_dir / "seoul-jeonse.csv", index=False, encoding="utf-8-sig")
(ROOT / "dist" / "analysis.ipynb").write_text(
    json.dumps(notebook, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
)
print("Exported two charts, the data, Plotly.js, and the assignment notebook.")
