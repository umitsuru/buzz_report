# 上下比較15枚シリーズ データベース（hikaku15）

Xの「上下で比べる15枚の画像シリーズ」の参考投稿を集める棚です。公開サイトのナビやページからはリンクしません。

サイト（上のメニューで行き来できます）
- 参考投稿：https://umitsuru.github.io/buzz_report/hikaku15/ （`posts/` の中身を自動で読み込んで表示）
- 画風カタログ：https://umitsuru.github.io/buzz_report/hikaku15/studio/ （GAFU-01〜10）
- 投稿案：https://umitsuru.github.io/buzz_report/hikaku15/plans/ （Claudeが作った10枚漫画のプロンプト。説明は `plans/README.md`）

## 役割分担

| 担当 | やること |
|---|---|
| グロッキー（Grok bot） | 投稿を探して、**生データ（本文・数字・画像・返信）をそのまま保存するだけ**。分析・要約・感想は書かない |
| Claude | 画像を見て分析し、`analysis.md`・`catalog.md`・`neta.md` を書く。新ネタを考える |

グロッキーは `index.html`・`analysis.md`・`catalog.md`・`neta.md`・`studio/`・`plans/` に触れないでください。

## フォルダ構成

```
hikaku15/
├─ README.md            この説明（グロッキーは変更しない）
├─ index.html           閲覧ページ（Claudeが管理）
├─ catalog.md           全投稿の一覧と傾向（Claudeが更新）
├─ neta.md              既出ネタ・制作中ネタ・提案済みネタ（Claudeが更新）
├─ studio/              画風カタログ（GAFU-01〜10）
├─ plans/               投稿案（10枚漫画のプロンプト。Claudeが管理）
└─ posts/
   └─ 20261120_1234567890123456789/   ← 収集日（JST）_元投稿のID
      ├─ raw.json       グロッキーが書く生データ
      ├─ img/01.jpg …   グロッキーが保存する画像（スレッド全体の出てくる順）
      └─ analysis.md    Claudeが書く分析
```

## グロッキーが集める投稿

- 1つの投稿＋セルフリプのスレッドで、**画像が合計8枚以上**ある「比較シリーズ」
  - 例：画像の隅に「1/15」「2/15」のような番号がある／上下や左右に2つの人物・家庭を並べて比べている／「〇〇 vs 〇〇」「〇〇な人と〇〇な人」
- 日本語の投稿で、投稿から7日以内
- 表示回数10万以上、またはいいね1,000以上
- 1回の収集で最大5件。数字の大きい順
- すでに `posts/` に同じIDのフォルダがあれば追加しない
- 自分のアカウント（@umitsuru_fire、@yamatsullu）の比較シリーズ投稿は、数字の条件に関係なく全部集める（`own: true`）

## 画像の保存

- X は1投稿に画像が最大4枚なので、15枚シリーズはセルフリプのスレッドに分かれています。**元投稿から最後のセルフリプまでたどり、全部の画像を出てくる順に** `img/01.jpg`、`img/02.jpg` … と保存
- できるだけ元のサイズ（`name=orig`）で保存。形式は jpg / png / webp のどれでもよい
- 動画やGIFは保存しなくてよい（`raw.json` の `note` に「動画あり」と書く）

## raw.json の形式

```json
{
  "id": "元投稿のID",
  "url": "https://x.com/…/status/…",
  "own": false,
  "collected_at": "2026-11-20T19:00:00+09:00",
  "author": { "name": "表示名", "handle": "@id", "followers": 12345 },
  "posted_at": "2026-11-18T21:03:00+09:00",
  "metrics": { "views": 0, "likes": 0, "reposts": 0, "quotes": 0, "replies": 0, "bookmarks": 0 },
  "text": "元投稿の本文を全文そのまま（改行・絵文字・ハッシュタグも）",
  "thread": [
    { "id": "元投稿のID", "text": "本文", "images": ["01.jpg", "02.jpg", "03.jpg", "04.jpg"] },
    { "id": "セルフリプのID", "text": "本文", "images": ["05.jpg", "06.jpg", "07.jpg", "08.jpg"] }
  ],
  "image_count": 15,
  "top_replies": [ { "text": "返信本文そのまま", "likes": 0 } ],
  "top_quotes": [ { "text": "引用投稿の本文そのまま", "likes": 0 } ],
  "note": "取れなかった項目や気づいたこと（なければ空）"
}
```

- 数字が読み取れないときは `null`。推測で埋めない
- `top_replies` はいいねの多い順に最大10件、`top_quotes` は最大5件。アカウント名は入れない

## 消さないもの

トレンドの「過去回は直近5日だけ」の整理で、`hikaku15/` は**削除しない**でください。`trends/` を作り直すときも対象外です。
