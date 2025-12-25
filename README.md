# AgriGuide Dashboard

農業機械用ガイダンスシステムのシミュレーター

![AgriGuide Dashboard](screenshot.png)

## 📋 プロジェクト概要

このプロジェクトは、農業機械（トラクター等）に搭載されるガイダンスシステムのダッシュボードをWebベースで再現したものです。リアルタイムでのデータ表示、走行経路の可視化、インタラクティブな操作が可能です。

## 🎯 開発目的

- **開発エンジニア**: フロントエンド技術（HTML/CSS/JavaScript）の実践
- **インフラエンジニア**: 将来的なバックエンド/クラウド連携の基盤
- **組み込みエンジニア**: ハードウェア（Raspberry Pi等）との連携を想定した設計

## ✨ 主な機能

### 現在実装済み
- ✅ リアルタイム速度・距離表示
- ✅ LEDバーによる視覚的なステータス表示
- ✅ Canvas を使った走行経路の可視化
- ✅ インタラクティブな操作（開始/停止/リセット）
- ✅ レスポンシブデザイン

### 今後実装予定
- 🔲 バックエンドAPI（Node.js/Express）
- 🔲 データベース連携（センサーデータの保存）
- 🔲 WebSocketによるリアルタイム通信
- 🔲 Raspberry Pi + GPSモジュールとの連携
- 🔲 地図ライブラリ（Leaflet.js）の統合
- 🔲 クラウドデプロイ（AWS/GCP）

## 🛠️ 技術スタック

### フロントエンド
- HTML5
- CSS3
- Vanilla JavaScript
- Canvas API

### 将来的に使用予定
- Node.js / Express
- SQLite / PostgreSQL
- WebSocket
- Leaflet.js
- Raspberry Pi
- GPS モジュール

## 🚀 セットアップ方法

1. リポジトリをクローン
```bash
git clone https://github.com/[あなたのユーザー名]/agri-guide-dashboard.git
cd agri-guide-dashboard
```

2. ブラウザで `index.html` を開く
```bash
# Windowsの場合
start index.html

# Macの場合
open index.html

# Linuxの場合
xdg-open index.html
```

3. 「開始」ボタンをクリックして動作確認

## 📂 プロジェクト構造
```
agri-guide-dashboard/
├── css/
│   └── style.css        # スタイルシート
├── js/
│   └── app.js           # アプリケーションロジック
├── index.html           # メインHTML
└── README.md            # このファイル
```

## 🎨 デザインコンセプト

実際の農業機械用ディスプレイ（CFX-750等）を参考に、視認性の高いUIを設計。暗い背景に明るい文字とグリーンのアクセントカラーを使用し、屋外での使用を想定した配色にしています。

## 📈 開発ロードマップ

### フェーズ1（完了）✅
- 基本UIの作成
- データ表示機能
- 走行経路の可視化

### フェーズ2（2週目予定）
- バックエンドAPI開発
- データベース連携
- WebSocket実装

### フェーズ3（将来）
- Raspberry Pi連携
- 実際のGPSデータ取得
- クラウドデプロイ

## 🔧 カスタマイズ

`js/app.js` で以下のパラメータを調整できます：
- 最大速度
- 走行経路の更新頻度
- LEDバーの感度

## 📝 ライセンス

MIT License

## 👤 作成者

[あなたの名前]

## 🙏 謝辞

このプロジェクトは就職活動用のポートフォリオとして作成されました。