import OpenAI from 'openai';

// APIキーが設定されていない場合のエラーを防ぐための確認
if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set in environment variables');
}

// APIキーがない場合はダミーのインスタンスを作成
export const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : {} as OpenAI; // TypeScriptのエラーを回避するためのキャスト

// チャットメッセージ型定義
export type ChatMessage = {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
};

// API経由でメッセージを送信し、レスポンスを取得する関数
export async function sendMessageToOpenAI(messages: ChatMessage[]): Promise<string> {
  try {
    // APIキーが設定されていない場合はダミーレスポンスを返す
    if (!process.env.OPENAI_API_KEY) {
      console.log('Using dummy response because OPENAI_API_KEY is not set');
      return 'APIキーが設定されていないため、AIアシスタントは応答できません。環境変数にOPENAI_API_KEYを設定してください。';
    }

    // OpenAI APIに送信するためのメッセージフォーマットに変換
    const formattedMessages = messages.map(({ role, content }) => ({
      role, 
      content
    }));

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // 使用するモデル
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || 'すみません、応答を生成できませんでした。';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'エラーが発生しました。しばらくしてからもう一度お試しください。';
  }
} 