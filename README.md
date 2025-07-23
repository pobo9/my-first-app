# BOH-LOG（ボーログ）

## 1. アプリケーション名と概要

BOH-LOG（ボーログ）は、仕事や勉強中の「ぼーっとした時間」を自己申告で記録し、それが「充電」か「浪費」かを自己評価・分析することで、集中力の波や行動パターンを可視化・改善する自己分析アプリです。

## 2. 作成の背景・目的

ぼーっとした時間"の質を可視化することで、自分の集中力や疲労パターンを把握し、より良い時間の使い方・自己管理をサポートすることを目的としています。

## 3. 機能一覧（要件定義）

- ✅ 「ぼーっとした時間」の記録（充電 / 浪費 の選択）
- ✅ ログ一覧の表示（時系列順）
- ✅ 分析機能（良い/悪いBOH比率、魔の時間帯、自分の傾向可視化）
- ✅ アバターの状態変化によるフィードバック
- ✅ 集中タイマー機能（ポモドーロ式）
- ✅ プロフィール編集機能（名前など）
- ✅ 実績・称号システム（予定）

## 4. 開発・起動コマンド例

```bash
# クローン
git clone https://github.com/your-username/boh-log.git
cd boh-log

# パッケージインストール
npm install

# iOS シミュレータで起動（Mac のみ）
npx expo start --ios

# Android エミュレータで起動
npx expo start --android

# Web で起動（開発用）
npx expo start --web
````

## 5. 使用技術

* **React Native**（Expo ベース）
* **TypeScript**
* **React Navigation**
* **AsyncStorage**（データ永続化）
* **Recharts**（グラフ描画：分析画面）

## 6. インストール方法・使用方法

1. **Node.js** をインストール（推奨: v18以上）
2. **Expo CLI** をグローバルにインストール：

   ```bash
   npm install -g expo-cli
   ```
3. プロジェクトをクローンして依存関係をインストール：

   ```bash
   git clone https://github.com/自分のユーザ名/boh-log.git
   cd boh-log
   npm install
   ```
4. アプリを起動：

   ```bash
   npx expo start
   ```
5. Expo Go アプリでQRコードを読み取ってモバイルで実行（iOS/Android）

## 7. 開発者情報

* **開発者名**：横山　晃
* **お問い合わせ**：[cshk23106@g.nihon-u.ac.jp]

