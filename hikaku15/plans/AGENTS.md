# hikaku15/plans 更新ガイド

このフォルダは、X用の10枚漫画のプロンプト集です。

- 追加・変更時は `index.json` と対象番号フォルダ内の `project.json`・`common.md`・各 `NN.md` を整合させる。
- ユーザーが画像生成を明示しない限り、画像を生成しない。既存の `images/` は無断削除しない。
- `common.md` の末尾には「画像はまだ作らないでください。これは全スライドの共通設定を伝えるためのプロンプトです。これから各スライドの指示を出すので、次の指示を待ってください。」の指示を残す。
- 画像形式のA/B/Cと縦横比を混同しない。実際の画像参照を目視していないなら作画技法を断定しない。
- GitHub接続が利用可能なら、ユーザーが更新を依頼したときは実ファイルを更新する。更新確認後、コミット結果とサイトURLを報告する。
- 詳細な読み書き手順はリポジトリ内の `/.agents/skills/hikaku15-github/SKILL.md` を参照。

## 投稿済みの記録（posted）と表示回数の更新

投稿した投稿案は、`index.json` のその投稿案に `posted` を付ける。投稿案ページでは「投稿済み」タブに移る。

```json
"posted": {
  "account": "うみつる",                 // うみつる・やまつる・そらつる のどれか
  "at": "2026-11-23T07:40:00+09:00",    // 投稿した日時（日本時間）
  "via": "Postiz",                      // Postiz / Chrome（引用ポスト）/ 手動 など
  "postiz_id": "cmws...",               // Postizで予約したときだけ
  "url": "https://x.com/.../status/...",// わからなければ null
  "text": "不倫夫の誤爆LINE",            // 投稿の本文
  "impressions": 123456,                // 最新の表示回数（インプレッション）だけ。履歴は残さない
  "impressions_at": "2026-11-23T21:00:00+09:00" // 表示回数を確認した日時
}
```

- Claude：Postizで予約したとき、またはChromeから投稿したときに `posted` を付ける（impressions は null のまま）。
- グロッキー（Grokのボット）：1日2回（朝9時ごろと夜21時ごろ）、`posted.at` から48時間以内の投稿案だけを見に行き、X上の最新の表示回数を `impressions` と `impressions_at` に上書きする。48時間を過ぎたものは更新しない。
  - `url` が null なら、そのアカウントのタイムラインから `posted.at` ごろに `posted.text` を本文にした投稿を探し、見つかったURLを `url` に入れる。
  - さわってよいのは `index.json` の `posted.url`・`posted.impressions`・`posted.impressions_at` だけ。ほかの項目、ほかのファイル（common.md、NN.md、project.json、images/、index.html）は変えない。
  - 更新がなければ保存（コミット）しない。保存するときのメッセージは「posted: 表示回数を更新（No.x, No.y）」の形にする。
