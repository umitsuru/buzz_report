#!/usr/bin/env python3
"""参考投稿（hikaku15/posts/*/img/）のサムネイル（thumb/、420px四方以内のJPEG）を、まだないものだけ作る。
参考投稿ページの一覧はサムネイルを使うので、これがないと元の大きな画像を読みに行って重くなる。"""
import pathlib
from PIL import Image

root = pathlib.Path(__file__).resolve().parent.parent / "posts"
made = 0
for img_dir in sorted(root.glob("*/img")):
    out = img_dir.parent / "thumb"
    for src in sorted(img_dir.iterdir()):
        if src.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
            continue
        dst = out / (src.stem + ".jpg")
        if dst.exists():
            continue
        out.mkdir(exist_ok=True)
        im = Image.open(src).convert("RGB")
        im.thumbnail((420, 420))
        im.save(dst, "JPEG", quality=82, optimize=True)
        made += 1
print(f"made {made} thumbnails")
