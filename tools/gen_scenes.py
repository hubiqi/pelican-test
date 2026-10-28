#!/usr/bin/env python3
"""生成阶段 1 的 20 个占位场景文件（每个版块一个文件，后续逐个替换 render）。"""
import pathlib, json

ROOT = pathlib.Path(__file__).resolve().parent.parent
SCENES = ROOT / "src" / "scenes"

DATA = [
    (1,  "s01-sahara",    "撒哈拉岩画",   "Sahara Rock Art",       "约前 4000 · 塔西里高原",
     dict(bg=[122,84,56], ground=[96,64,42], frame=[158,102,56], ink=[42,26,16], body=[222,160,96], accent=[206,120,58], motif="dots")),
    (2,  "s02-egypt",     "埃及壁画",     "Egyptian Tomb Painting","约前 1300 · 底比斯",
     dict(bg=[214,190,146], ground=[196,166,118], frame=[140,108,64], ink=[34,42,78], body=[232,216,178], accent=[170,68,46], motif="grid")),
    (3,  "s03-hanstone",  "汉画像石拓片", "Han Stone Rubbing",     "约 100 · 山东",
     dict(bg=[20,20,16], ground=[14,14,12], frame=[70,66,58], ink=[236,232,220], body=[210,206,192], accent=[120,116,104], cardInk=[236,232,220], motif="lines")),
    (4,  "s04-tang",      "唐代白描",     "Tang Ink Outline",      "约 750 · 长安",
     dict(bg=[240,235,222], ground=[228,222,206], frame=[190,182,164], ink=[26,24,22], body=[248,246,240], accent=[120,110,96], motif="lines")),
    (5,  "s05-song",      "宋代山水",     "Song Landscape",        "约 1000 · 范宽《溪山行旅图》",
     dict(bg=[206,202,192], ground=[176,172,160], frame=[120,116,104], ink=[48,48,44], body=[235,232,224], accent=[92,96,90], motif="waves")),
    (6,  "s06-qingming",  "清明上河图",   "Along the River",       "约 1100 · 张择端",
     dict(bg=[216,200,164], ground=[198,182,146], frame=[140,120,86], ink=[52,44,36], body=[242,236,222], accent=[96,120,84], motif="dots")),
    (7,  "s07-maya",      "玛雅抄本",     "Maya Codex",            "约 1200 · 尤卡坦",
     dict(bg=[228,210,158], ground=[208,190,138], frame=[150,60,44], ink=[110,40,34], body=[236,222,180], accent=[58,90,140], motif="grid")),
    (8,  "s08-mughal",    "莫卧儿细密画", "Mughal Miniature",      "约 1600 · 拉合尔",
     dict(bg=[236,220,178], ground=[214,196,152], frame=[196,160,60], ink=[58,48,34], body=[246,238,214], accent=[96,124,72], motif="zig")),
    (9,  "s09-bada",      "八大山人写意", "Bada Shanren",          "约 1690 · 南昌",
     dict(bg=[246,243,232], ground=[238,235,224], frame=[200,196,184], ink=[30,30,28], body=[252,251,246], accent=[110,110,104], motif="waves")),
    (10, "s10-wayang",    "爪哇皮影戏",   "Wayang Kulit",          "约 1800 · 中爪哇",
     dict(bg=[26,18,22], ground=[20,14,18], frame=[120,86,40], ink=[232,190,110], body=[212,158,74], accent=[214,160,72], cardInk=[240,206,150], motif="zig")),
    (11, "s11-ukiyoe",    "浮世绘",       "Ukiyo-e · Tokaido",     "1830s · 歌川广重",
     dict(bg=[34,62,104], ground=[58,84,110], frame=[216,200,168], ink=[22,34,58], body=[236,226,200], accent=[188,72,52], motif="waves")),
    (12, "s12-vangogh",   "星月夜",       "The Starry Night",      "1889 · 圣雷米",
     dict(bg=[30,52,96], ground=[26,44,72], frame=[190,160,80], ink=[18,28,52], body=[226,214,168], accent=[242,193,78], motif="waves")),
    (13, "s13-scream",    "呐喊",         "The Scream",            "1893 · 奥斯陆",
     dict(bg=[200,98,52], ground=[40,68,96], frame=[120,70,50], ink=[38,34,44], body=[226,214,196], accent=[170,70,50], motif="waves")),
    (14, "s14-nosferatu", "诺斯费拉图",   "Nosferatu",             "1922 · 默片",
     dict(bg=[12,12,14], ground=[8,8,10], frame=[70,66,60], ink=[214,210,198], body=[150,148,140], accent=[180,176,164], cardInk=[220,216,204], motif="lines")),
    (15, "s15-scope",     "示波器矢量图", "Oscilloscope Vector",   "1950s · 实验室",
     dict(bg=[4,18,10], ground=[4,14,8], frame=[40,60,46], ink=[86,255,150], body=[70,230,140], accent=[120,255,180], cardInk=[120,255,170], motif="grid")),
    (16, "s16-8bit",      "8-bit 像素游戏", "8-bit Platformer",    "1980s · 客厅",
     dict(bg=[26,26,46], ground=[18,18,34], frame=[233,69,96], ink=[246,211,101], body=[230,230,240], accent=[233,69,96], motif="grid")),
    (17, "s17-chat",      "早期聊天窗口", "Early Chat Client",     "2000s · 网吧",
     dict(bg=[212,208,200], ground=[196,192,184], frame=[90,110,160], ink=[32,32,32], body=[244,244,240], accent=[10,36,106], motif="lines")),
    (18, "s18-vaporwave", "蒸汽波",       "Vaporwave",             "2010s · 商场磁带",
     dict(bg=[52,40,88], ground=[70,30,90], frame=[255,113,206], ink=[32,22,58], body=[240,225,245], accent=[1,205,254], motif="grid")),
    (19, "s19-vertical",  "竖屏短视频",   "Vertical Video",        "2020s · 算法推荐",
     dict(bg=[18,18,20], ground=[26,26,30], frame=[40,40,44], ink=[240,240,240], body=[250,250,250], accent=[254,44,85], cardInk=[240,240,240], motif="dots")),
    (20, "s20-code",      "代码美学",     "Code Aesthetic",        "2020s · 大模型时代",
     dict(bg=[13,17,23], ground=[22,27,34], frame=[48,54,61], ink=[230,237,243], body=[200,220,230], accent=[126,231,135], cardInk=[230,237,243], motif="lines")),
]

TPL = """/* {fname}.js — 第 {n} 版块 · {zh}（{era}）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {{
  const P = (root.PEL = root.PEL || {{}});
  P.scenes = P.scenes || {{}};
  P.scenes.{key} = {{
    id: {id!r}, n: {n}, zh: {zh!r}, en: {en!r}, era: {era!r},
    stage: 1,
    palette: {pal},
    render: function (g, ctx) {{ P.placeholder.render(g, this, ctx); }},
  }};
}})(typeof window !== 'undefined' ? window : globalThis);
"""

def js_pal(p):
    out = []
    for k, v in p.items():
        out.append(f"{k}: " + (repr(v) if isinstance(v, str) else "[" + ", ".join(str(x) for x in v) + "]"))
    return "{ " + ", ".join(out) + " }"

def main():
    SCENES.mkdir(parents=True, exist_ok=True)
    for n, sid, zh, en, era, pal in DATA:
        key = sid.split("-")[0]
        path = SCENES / f"{sid}.js"
        path.write_text(TPL.format(fname=sid, n=n, zh=zh, en=en, era=era, key=key,
                                   id=sid, pal=js_pal(pal)), encoding="utf-8")
    print(f"wrote {len(DATA)} scene files")

if __name__ == "__main__":
    main()
