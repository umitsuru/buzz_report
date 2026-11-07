# 日次生成への組み込み

公開サイトは **最新トレンド画像投稿だけ** です。見た目は投稿HTMLを作り直さず、共有の CSS / JS で揃えています。背景は黒（`#000` 付近）、投稿カードは横に3枚の3列です。次の生成でこの見た目を残すには、ローカルの `/workspace/x_analysis/trends_build/` に次を足してください。

## 残すファイル

毎回の公開で、この2つを **上書きも削除もしない** でください。

- `trends/assets/trends.css`
- `trends/assets/trends.js`

投稿データから生成しない固定アセットです。リポジトリに既にあるので、生成処理が `trends/` を全消去してから書き出す場合だけ、書き出し後にこの2ファイルを戻してください。

## HTMLに足す2行

クラス名や本文はそのままです。`<head>` の末尾と `</body>` の直前に、画像と同じ相対プレフィックスで読み込んでください。

`trends/index.html`（画像が `img/...` の最新ページ）:

```html
<link rel="stylesheet" href="assets/trends.css">
<script src="assets/trends.js"></script>
```

`trends/20261106-1900/index.html` のような過去回（画像が `../img/...` のページ）:

```html
<link rel="stylesheet" href="../assets/trends.css">
<script src="../assets/trends.js"></script>
```

CSSは既存の `<style>` より **後ろ** に置いてください。JSは既存の並べ替え用 `<script>` より後ろでも、`<head>` 内の `defer` でも動きます。生成のたびに `trends.css` を紙色や1列用のCSSで置き換えないでください。このファイルが黒背景と3列の正です。

1つのテンプレート文字列しか出せない場合は、深さに依存しない次のURLでもライブサイトでは動きます。

```html
<link rel="stylesheet" href="/buzz_report/trends/assets/trends.css">
<script src="/buzz_report/trends/assets/trends.js"></script>
```

この絶対パスは GitHub Pages の `/buzz_report/` 専用です。リポジトリ直下を別のパスで開くローカル確認ではCSSが当たりません。

## 見た目は黒背景の3列

`trends/assets/trends.css` を最後に読み込みます。最新は `assets/trends.css`、過去回は `../assets/trends.css` です。

- ページ背景は `#000`。カード、表、ナビも暗色で、本文と画像が読める文字色にする
- `.cards` は常に3列。PCとタブレット（幅760px以上）は3列が幅に収まる
- それより狭い画面も1列に戻さない。カード最小幅 300px の3列のまま、`.cards` の中だけ横スクロールする
- 生成HTMLの `@media(max-width:560px){ .cards{ grid-template-columns:1fr } }` は共有CSSが上書きする。1列用の指定を足し直さない
- 白や紙色（`#f3f0ea` や `#fff`）の背景には戻さない

## 更新時刻

公開は日本時間で1日2回です。朝 6:00 と夜 19:00 で、それぞれ前後15分以内。生成文に回数を書くときは「1日2回（朝6時・夜19時 JST）」にしてください。

## 出さないリンク

ヘッダーとナビから次を削除してください。JS側でも同じ条件のリンクは除去します。

- `episodes/` や `accounts/` を含む href
- 表示文字が「週次分析」「バズ投稿分析」「エピソード系」「アカウントまとめ」「テキスト4」のリンク

過去回ページの「最新回を見る」（`href="../"`）と「過去の回」（`#arch`）は残してください。

## ルートは転送のまま

`/index.html` は `trends/` への即時転送です。週次レポートで上書きしないでください。`episodes/`、`accounts/`、リポジトリ直下の `img/` は公開しないでください。

## 変えないもの

- `<meta name="robots" content="noindex,nofollow">`
- 外部リンクの `target="_blank"` と `rel="noopener noreferrer"`（JSでも補完します）
- セクション id: `own` `pts` `rank` `tbl` `arch`
- カードのクラス: `kpi` `ownbox` `card` `own` `ch` `rk` `who` `av` `ic` `b` `gen` `imgs` `pimg` `sc` `mt` `whyt` `btn` `tw` `sortable` `arch` `note` `pt`
- 投稿本文、表示数、順位、画像ファイル、アカウント順位

`#tbl`（一覧表）と `#arch`（過去の回）は、同じ数字のカードと重複するため、JSが閉じた折りたたみにします。中身は削除しません。ナビの「一覧表」「過去の回」で開きます。

## 過去回は直近5日だけ

公開のたびに、日本時間の暦日で **今日を含む5日** より古いスナップショットを消してください。2026-11-07 に実行するなら残すのは 11/03〜11/07 で、日付が 11/02 以前の回は削除です。

判定はスナップショット名の先頭8桁（`YYYYMMDD`）です。`20261102-1900` は 2026-11-02、`20261024-PM` は 2026-10-24 です。

- 残す: `trends/index.html`（常に）。日付が今日から4日前までの `trends/<id>/index.html`
- 消す: それより古い `trends/<id>/` ディレクトリ
- 続けて `trends/img/<id>/` を消す。ただし残したHTMLが参照している画像は残す
- `trends/img/icons/` は共有アイコンなので消さない
- 残したHTMLの「過去の回」から、消した `<id>` へのリンクを除く
- `trends/assets/` は消さない

このリポジトリに生成スクリプトは無いので、ローカルの `/workspace/x_analysis/trends_build/` の公開処理の最後で実行してください。日付は実行機の時刻ではなく `Asia/Tokyo` の暦日です。

```python
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo
import re, shutil

ROOT = Path("/path/to/buzz_report/trends")  # 公開先

def prune_trends(root: Path = ROOT) -> None:
    today = datetime.now(ZoneInfo("Asia/Tokyo")).date()
    oldest = today - timedelta(days=4)  # 今日を含めて5日
    def snap_day(name):
        m = re.match(r"(\d{4})(\d{2})(\d{2})", name)
        if not m:
            return None
        return datetime(int(m[1]), int(m[2]), int(m[3])).date()
    expired = set()
    for p in root.iterdir():
        if not p.is_dir() or p.name in {"img", "assets"}:
            continue
        day = snap_day(p.name)
        if day is not None and day < oldest:
            expired.add(p.name)
    kept = [root / "index.html"]
    kept += [p / "index.html" for p in root.iterdir()
             if p.is_dir() and p.name not in expired | {"img", "assets"}]
    used = set()
    for html in kept:
        if not html.is_file():
            continue
        text = html.read_text(encoding="utf-8")
        for raw in re.findall(r'(?:src|href)="([^"]+)"|url\(([^)]+)\)', text):
            rel = (raw[0] or raw[1]).strip("'\"")
            if rel.startswith(("http", "#", "data:")) or "img/" not in rel:
                continue
            used.add((html.parent / rel).resolve())
        text2 = re.sub(
            r'\s*<a\b[^>]*href="[^"]*(?:' + "|".join(map(re.escape, expired)) + r')/?[^"]*"[^>]*>.*?</a>',
            "", text) if expired else text
        if text2 != text:
            html.write_text(text2, encoding="utf-8")
    for name in expired:
        folder = root / name
        if folder.exists():
            shutil.rmtree(folder)
    img = root / "img"
    if img.is_dir():
        for folder in img.iterdir():
            if not folder.is_dir() or folder.name == "icons":
                continue
            files = [f for f in folder.rglob("*") if f.is_file()]
            if files and all(f.resolve() not in used for f in files):
                shutil.rmtree(folder)
            else:
                for f in files:
                    if f.resolve() not in used:
                        f.unlink()
```

リンク除去の正規表現は、期限切れIDを `href` に含む過去回リンクだけを対象にしています。投稿そのもの（`https://x.com/...`）は `img/` もスナップショットIDも通常含まないので残ります。

## 先頭の色（白のちらつきを避ける）

生成HTMLの先頭は黒にしてください。共有CSSが当たる前の一瞬も紙色にしないためです。

```html
<html lang="ja" data-theme="dark" style="background:#000">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#000">
```

`trends.js` も開いたときにこの3つを黒へ揃えます。`data-theme="light"` や `#f3f0ea` は書かないでください。
