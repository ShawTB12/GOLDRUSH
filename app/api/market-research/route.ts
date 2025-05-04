import { NextRequest, NextResponse } from 'next/server';
import { sendMessageToOpenAI } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: 'クエリが必要です' },
        { status: 400 }
      );
    }

    // 市場調査のためのプロンプトを作成
    const marketResearchPrompt = {
      role: 'system',
      content: `以下のクエリについて、市場調査を行ってください。以下の4つのカテゴリーに分けて分析してください：
      1. 市場規模：現在の市場規模、成長率、主要な市場セグメント
      2. 競合分析：主要な競合企業、市場シェア、競争力
      3. 機会：新規参入の機会、成長の可能性、未開拓の市場
      4. 課題：市場参入の障壁、リスク、克服すべき課題

      クエリ: ${query}`
    };

    // OpenAI APIにリクエストを送信
    const response = await sendMessageToOpenAI([marketResearchPrompt]);

    // 応答を4つのカテゴリーに分割
    const sections = response.split('\n\n');
    const marketData = {
      marketSize: sections[0] || '',
      competitors: sections[1] || '',
      opportunities: sections[2] || '',
      challenges: sections[3] || ''
    };

    return NextResponse.json(marketData);
  } catch (error) {
    console.error('市場調査APIエラー:', error);
    return NextResponse.json(
      { error: '市場調査の処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 