"use client"

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Settings, 
  X,
  ChevronLeft
} from 'lucide-react';
import { ChatHistory } from '@/hooks/use-chat-history';
import { Background } from '@/hooks/use-background';
import { useRouter } from 'next/navigation';

type SidebarProps = {
  chatHistory: ChatHistory[];
  onNewChat: () => Promise<void>;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  currentChatId?: string;
  isMobile?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  background?: Background;
  onShowSettings?: () => void;
};

export function Sidebar({
  chatHistory,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  currentChatId,
  isMobile = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  background,
  onShowSettings
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const startupAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      startupAudioRef.current = new Audio('/sounds/goldrush-startup.mp3');
    }
    
    return () => {
      if (startupAudioRef.current) {
        startupAudioRef.current.pause();
        startupAudioRef.current = null;
      }
    };
  }, []);

  const handleStartupClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // 直接音声を再生する
      const audio = new Audio('/sounds/goldrush-startup-backup.mp3');
      audio.volume = 1.0;
      
      // 音声を再生
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('音声再生成功');
          })
          .catch(err => {
            console.error('音声再生エラー:', err);
            // 自動再生ポリシーの制限がある場合は、ユーザーインタラクションをシミュレート
            document.body.click();
            audio.play().catch(e => console.error('2回目の再生試行も失敗:', e));
          });
      }
      
      // 親コンポーネントの処理も実行
      await onNewChat();
    } catch (err) {
      console.error('チャット作成エラー:', err);
    }
  };

  const filteredChats = chatHistory.filter(
    (chat) => 
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = 
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const defaultBackgroundPath = background?.path || '/backgrounds/GOLDRUSH.jpg';

  return (
    <div
      className="flex h-full w-full flex-col bg-black/40 backdrop-blur-md text-gray-200 overflow-hidden border-r border-gray-800/20 shadow-lg transition-all duration-300 ease-in-out"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src={defaultBackgroundPath}
          alt="Sidebar background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(90deg, rgba(131, 58, 180, 0.5) 0%, rgba(253, 29, 29, 0.5) 50%, rgba(252, 176, 69, 0.5) 100%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="flex items-center justify-between p-4 border-b border-gray-700/20">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push('/'); }}
        >
          <div className="bg-black rounded-full overflow-hidden flex items-center justify-center" style={{ padding: 0, lineHeight: 0, fontSize: 0, width: 32, height: 32 }}>
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={32}
              height={32}
              className="block"
              style={{ margin: 0, display: 'block' }}
              priority
            />
          </div>
          <h2 className="text-xl font-bold tracking-wide text-gray-200" style={{ letterSpacing: '0.05em' }}>GOLD RUSH</h2>
        </div>
        <div className="flex items-center ml-auto">
          {isMobile ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose && onClose();
              }}
              className="rounded-full p-1.5 bg-gray-800/50 hover:bg-gray-700/60 text-gray-300 border border-gray-700/20"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleCollapse && onToggleCollapse();
              }}
              className="rounded-full p-1.5 bg-gray-800/50 hover:bg-gray-700/60 text-gray-300 border border-gray-700/20"
              aria-label="サイドバーを閉じる"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        <button
          onClick={handleStartupClick}
          className="w-full flex items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium transition-colors mb-3 shadow-lg border-0"
          style={{
            background: "linear-gradient(135deg, #000 0%, #AA8C3F 45%, #D4AF37 55%, #000 100%)",
            color: "#FFF",
            fontWeight: "bold",
            textShadow: "0px 1px 2px rgba(0,0,0,0.7)",
            boxShadow: "0 4px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.4)"
          }}
        >
          <Plus className="h-4 w-4" />
          <span>GOLDRUSHを起動する</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {!isClient ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-400 p-4">
            <MessageSquare className="mb-2 h-8 w-8" />
            <p>読み込み中...</p>
          </div>
        ) : filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`mb-1 flex cursor-pointer items-center justify-between rounded-md p-3 text-sm ${
                currentChatId === chat.id
                  ? 'bg-gray-800/60 border border-gray-700/20 shadow-md'
                  : 'hover:bg-gray-900/40 border border-transparent hover:border-gray-700/20'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare className="h-5 w-5 shrink-0 text-gray-400" />
                <div className="overflow-hidden">
                  <p className="truncate font-medium text-gray-200">{chat.title}</p>
                  <p className="truncate text-xs text-gray-400">
                    {chat.lastMessage || '新しい会話を開始します'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {formatDate(chat.timestamp)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-400 p-4">
            <MessageSquare className="mb-2 h-8 w-8" />
            <p>チャット履歴がありません</p>
            <p className="text-sm">「新規チャット」をクリックして会話を始めましょう</p>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-gray-700/20 p-4">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onShowSettings) {
              onShowSettings();
            } else {
              alert('設定メニューは開発中です');
            }
          }}
          className="flex w-full items-center gap-2 rounded-md bg-gray-800/50 p-2 text-sm hover:bg-gray-700/60 text-gray-300 border border-gray-700/20 shadow-md"
        >
          <Settings className="h-4 w-4" />
          <span>設定</span>
        </button>
      </div>
    </div>
  );
} 