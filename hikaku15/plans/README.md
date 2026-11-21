# 投稿案（plans）

Claudeが作った10枚漫画のプロンプト置き場です。閲覧ページ：https://umitsuru.github.io/buzz_report/hikaku15/plans/

## 番号とフォルダ

- 投稿案の番号（No.1, No.2 …）は `index.json` の `no`。フォルダ名はその3桁（No.1 → `001/`）
- 各フォルダの中身
  - `common.md`：全ページ共通の設定（読んだだけでは画像を作らない）
  - `01.md`〜`10.md`：各ページの完成版プロンプト
  - `project.json`：作品情報、画風（GAFU番号）、参考投稿、ページ一覧

## ChatGPTの画像生成ボットの動き

「投稿案No.Xの a〜b枚目を作って」と言われたら：

1. `https://umitsuru.github.io/buzz_report/hikaku15/plans/index.json` で No.X のフォルダを確認
2. `…/plans/<フォルダ>/common.md` を読む（ここでは画像を作らない）
3. a枚目から b枚目まで、`…/plans/<フォルダ>/NN.md` を1つずつ読み、1ページにつき1枚生成する
4. 画風の参考画像は `project.json` の `style.reference_image`

## 担当

- Claude：投稿案の追加・修正、`index.json` の更新
- グロッキー：このフォルダには触らない
