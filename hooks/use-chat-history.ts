import { useState, useEffect } from 'react';

// チャット履歴のタイプ定義
export type ChatHistory = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
};

export function useChatHistory() {
  // ローカルストレージから初期チャット履歴を取得
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>(() => {
    if (typeof window === 'undefined') return [];
    
    const savedHistory = localStorage.getItem('chatHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // チャット履歴が変更されたらローカルストレージに保存
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // 新規チャットを追加
  const addChat = (title: string = '新しいチャット') => {
    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title,
      lastMessage: '',
      timestamp: new Date().toISOString(),
    };
    
    setChatHistory((prev) => [newChat, ...prev]);
    return newChat.id;
  };

  // チャットを更新
  const updateChat = (id: string, data: Partial<ChatHistory>) => {
    setChatHistory((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, ...data } : chat))
    );
  };

  // チャットを削除
  const deleteChat = (id: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== id));
  };

  // すべてのチャットをクリア
  const clearAllChats = () => {
    setChatHistory([]);
  };

  return {
    chatHistory,
    addChat,
    updateChat,
    deleteChat,
    clearAllChats,
  };
} 