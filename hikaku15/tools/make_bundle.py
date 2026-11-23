#!/usr/bin/env python3
"""参考投稿（hikaku15/posts/*/raw.json と analysis.md）を1つのファイル posts/bundle.json にまとめる。
参考投稿ページはこれを1回読むだけで一覧を出せる（フォルダごとに何十回も読みに行かなくてよくなる）。"""
import json, pathlib

root = pathlib.Path(__file__).resolve().parent.parent / "posts"
items = []
for d in sorted(p for p in root.iterdir() if p.is_dir()):
    raw = d / "raw.json"
    if not raw.exists():
        continue
    try:
        r = json.loads(raw.read_text())
    except Exception:
        continue
    a = d / "analysis.md"
    items.append({"folder": d.name, "raw": r, "analysis": a.read_text() if a.exists() else None})
out = root / "bundle.json"
new = json.dumps({"posts": items}, ensure_ascii=False, separators=(",", ":"))
if not out.exists() or out.read_text() != new:
    out.write_text(new)
    print(f"bundle.json: {len(items)} posts")
else:
    print("bundle.json: no change")
