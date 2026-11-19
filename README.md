# 最新トレンド画像投稿

公開サイトは最新トレンド画像投稿だけです。`/` は `trends/` へ転送します。過去のトレンド回は日本時間で今日を含む5日分だけ残し、ページ下部の「過去の回」から開きます。見た目は黒背景で、投稿は横に3枚並ぶ3列です。狭い画面でも1列にはせず、3列のまま横にスクロールします。更新は日本時間の朝6時と夜19時（各±15分）の2回です。

日次生成（`/workspace/x_analysis/trends_build/`）へ合わせる手順は [trends/assets/INTEGRATION.md](trends/assets/INTEGRATION.md) です。`trends/assets/trends.css` と `trends/assets/trends.js` は生成のたびに残してください。

## 上下比較15枚データベース

`hikaku15/` は「上下で比べる15枚の画像シリーズ」の参考投稿を集めるデータ置き場です。サイトからはリンクしません。トレンドの5日分整理や `trends/` の作り直しでは削除しないでください。集め方と保存形式は [hikaku15/README.md](hikaku15/README.md) です。
