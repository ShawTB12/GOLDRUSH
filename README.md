# ChatGPTチャットアプリケーション

このプロジェクトは、Next.jsを使用して構築されたリアルタイムチャットアプリケーションです。OpenAI APIを統合してAIアシスタントとの会話を実現しています。

## 機能

- モダンなUI/UXデザイン
- ChatGPT APIを使用したAIチャット
- リアルタイムメッセージ処理
- レスポンシブデザイン

## 初期設定

1. パッケージをインストールします：

```bash
npm install
# または
yarn install
# または
pnpm install
```

2. `.env.local`ファイルをルートディレクトリに作成し、以下の環境変数を設定します：

```
OPENAI_API_KEY=your_openai_api_key_here
```

OpenAI APIキーは[OpenAIのプラットフォーム](https://platform.openai.com/)から取得できます。

## 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて、アプリケーションを確認します。

## 使用技術

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI API](https://openai.com/) 