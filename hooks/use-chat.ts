import { useState, useCallback } from 'react';
import { ChatMessage } from '@/lib/openai';

type UseChatProps = {
  initialMessages?: ChatMessage[];
};

export function useChat({ initialMessages = [] }: UseChatProps = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // メッセージを送信する関数
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // ユーザーメッセージを追加
      const userMessage: ChatMessage = {
        id: Date.now(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // API経由でメッセージを送信
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: updatedMessages,
          marketResearch: true // 市場調査フラグを追加
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'APIリクエストに失敗しました');
      }

      const { response: assistantResponse } = await response.json();

      // アシスタントの返信を追加
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('メッセージ送信エラー:', err);
      setError(err instanceof Error ? err.message : '未知のエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  // メッセージを削除する関数
  const deleteMessage = useCallback((id: number) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  }, []);

  // メッセージをクリアする関数
  const clearMessages = useCallback(() => {
    // 初期メッセージを設定（アシスタントの挨拶メッセージなど）
    const welcomeMessage: ChatMessage = {
      id: Date.now(),
      role: 'assistant',
      content: "こんにちは！何かお手伝いできることはありますか？",
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    deleteMessage,
    clearMessages,
  };
} 