import { NextRequest, NextResponse } from 'next/server';
import { sendMessageToOpenAI, ChatMessage } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { messages, marketResearch } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: '無効なメッセージ形式です' },
        { status: 400 }
      );
    }

    // 市場調査フラグがtrueの場合、市場調査を開始
    if (marketResearch) {
      // 市場調査のための追加のプロンプトを設定
      const marketResearchPrompt = {
        role: 'system',
        content: 'このメッセージは市場調査を目的としています。ユーザーの入力に基づいて、市場の現状、競合分析、機会と課題について分析してください。'
      };
      
      // メッセージの先頭に市場調査プロンプトを追加
      messages.unshift(marketResearchPrompt);
    }

    // OpenAI APIにメッセージを送信
    const response = await sendMessageToOpenAI(messages);

    // 応答を返す
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'リクエストの処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 