# 画風カタログ（studio）

**公開ページ**：https://umitsuru.github.io/buzz_report/hikaku15/studio/

## ページの中身
1. **集めた投稿の画風**：グロッキーが集めた全投稿を、「参考投稿」ページと同じ番号（No.）で並べる。カードの「この画風で指示をコピー」で、その投稿を画風の参考にする指示文がコピーできる。Claudeには「画風は No.54 で」と番号で伝えればよい
2. **オリジナル画風（S-01〜）**：Claudeが考えた、Xでまだ見かけない画風。`original_styles.json` に画風指定と見本用プロンプトがあり、見本画像は `originals/S-01.jpg` のように置く

## ファイル
- `index.html`：ページ本体（CSSとJSも中に入っている）
- `styles.json`：初期に選んだ10件の画風ID（GAFU-01〜10）と投稿の対応。カードの右上に GAFU 番号として表示する。投稿案No.1 は GAFU-07 を使っている
- `original_styles.json`：オリジナル画風の定義（id, name, hook, spec, why, image, sample_prompt）
- `originals/`：オリジナル画風の見本画像

## 担当
- Claude：このフォルダを管理する
- グロッキー：このフォルダには触らない

元の人物・セリフ・物語・構図はコピーせず、画風の一般的な特徴だけを参考にする。
