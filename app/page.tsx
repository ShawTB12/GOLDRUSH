"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Settings,
  Menu,
  Clock,
  MapPin,
  Users,
  Sparkles,
  X,
  Send,
  Paperclip,
  Mic,
  Image as ImageIcon,
  Loader2,
  PanelLeft,
  Sidebar as SidebarIcon,
  Menu as MenuIcon,
  AlignLeft,
  File,
  BarChart3,
  CheckCircle2
} from "lucide-react"
import { useChat } from "@/hooks/use-chat"
import { useChatHistory } from "@/hooks/use-chat-history"
import { useBackground } from "@/hooks/use-background"
import { ChatMessage } from "@/lib/openai"
import { Sidebar } from "@/components/sidebar"
import { BackgroundSelector } from "@/components/background-selector"
import { useIsMobile } from "@/components/ui/use-mobile"
import { StartupAnimation } from "@/components/startup-animation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

// TypeScript定義 - Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: any;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal?: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  new(): SpeechRecognition;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAIPopup, setShowAIPopup] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [inputMessage, setInputMessage] = useState("")
  const [showSidebar, setShowSidebar] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | undefined>()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{id: number, type: string, url: string, name: string}[]>([])
  // 音声入力関連のステート
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<any | null>(null)
  const [showMarketAgents, setShowMarketAgents] = useState(false)
  const [marketQuery, setMarketQuery] = useState("")
  // スタートアップアニメーションのステート
  const [showStartupAnimation, setShowStartupAnimation] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  const isMobile = useIsMobile()
  
  // チャット履歴の管理
  const { 
    chatHistory, 
    addChat, 
    updateChat, 
    deleteChat 
  } = useChatHistory();
  
  // 背景の管理
  const {
    background,
    availableBackgrounds,
    changeBackground
  } = useBackground();
  
  // 初期メッセージ
  const initialMessages: ChatMessage[] = [
    {
      id: 1,
      role: 'assistant',
      content: "私たちで日本を変えるビジネスを共創しましょう！",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    }
  ];
  
  // チャットフックを使用
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage,
    clearMessages
  } = useChat({ 
    initialMessages 
  });

  // ファイルアップロード用のref
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  useEffect(() => {
    // 初期化処理
    setIsClient(true); 
    setIsLoaded(true);
    
    // ページロード時に常にログイン画面を表示するシンプルな実装
    setShowStartupAnimation(true);
    setIsLoggedIn(false);
  }, []); // 空の依存配列

  // スタートアップアニメーションが完了したらAIポップアップを表示
  useEffect(() => {
    if (!showStartupAnimation && isLoggedIn) {
      const timer = setTimeout(() => {
        setShowAIPopup(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [showStartupAnimation, isLoggedIn]);
  
  // チャット初期化
  useEffect(() => {
    if (chatHistory.length === 0) {
      const newChatId = addChat();
      setCurrentChatId(newChatId);
    } else if (chatHistory[0]?.id) {
      setCurrentChatId(chatHistory[0].id);
    }
  }, [chatHistory, addChat]);

  // アニメーション完了時のハンドラー（シンプル化）
  const handleAnimationComplete = () => {
    setShowStartupAnimation(false);
    setIsLoggedIn(true);
  };

  // メッセージが更新されたらチャット履歴を更新
  useEffect(() => {
    if (!currentChatId || messages.length === 0 || !isClient) return;
    
    // 最新のメッセージを取得
    const lastMessage = messages[messages.length - 1];
    
    // 短い要約（タイトル）を最初のユーザーメッセージから生成
    const userFirstMessage = messages.find(msg => msg.role === 'user');
    if (userFirstMessage) {
      const title = userFirstMessage.content.slice(0, 30) + (userFirstMessage.content.length > 30 ? '...' : '');
      
      // チャット履歴を更新
      updateChat(currentChatId, {
        title,
        lastMessage: lastMessage.content.slice(0, 60) + (lastMessage.content.length > 60 ? '...' : ''),
        timestamp: new Date().toISOString()
      });
    }
  }, [messages, currentChatId, isClient])

  useEffect(() => {
    if (showAIPopup) {
      const text =
        "　私たちで日本を変えるビジネスを共創しましょう！"
      let i = 0
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setTypedText((prev) => prev + text.charAt(i))
          i++
        } else {
          clearInterval(typingInterval)
        }
      }, 50)

      return () => clearInterval(typingInterval)
    }
  }, [showAIPopup])

  // サイドバーの収縮状態を切り替える
  const toggleSidebarCollapse = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsSidebarCollapsed(prev => !prev);
  };

  // サイドバーを展開する
  const expandSidebar = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsSidebarCollapsed(false);
  };

  // 新規チャットを作成
  const handleNewChat = () => {
    const newChatId = addChat();
    setCurrentChatId(newChatId);
    clearMessages();
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  // チャットを選択
  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
    // ここでは、選択したチャットの内容を読み込む処理を追加する必要があります
    // 実際のアプリケーションでは、チャットIDに基づいてバックエンドからメッセージを取得する
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  // メッセージ送信処理
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;
    try {
      await sendMessage(inputMessage);
      setInputMessage("");
      setMarketQuery(inputMessage);
      setShowMarketAgents(true);
    } catch (error) {
      console.error("メッセージ送信エラー:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      // エンターキーでの送信を無効化
    }
  }

  // タイムスタンプをフォーマット
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // サイドバーの幅を計算（モバイル、収縮状態に応じて変化）
  const sidebarWidth = isMobile ? 0 : (isSidebarCollapsed ? 64 : 280);

  // デフォルトの背景パス（SSRでもクライアントでも同じ値を使用）
  const defaultBackgroundPath = background?.path || '/backgrounds/GOLDRUSH.jpg';

  // ファイル選択ダイアログを開く
  const handleFileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }
  
  // 画像選択ダイアログを開く
  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  }
  
  // ファイルがアップロードされた時の処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileReader = new FileReader();
    
    fileReader.onload = (e) => {
      if (!e.target || typeof e.target.result !== 'string') return;
      
      // 新しいファイルをアップロードリストに追加
      const newFile = {
        id: Date.now(),
        type: 'file',
        url: e.target.result,
        name: file.name
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      
      // ファイル情報をメッセージとして送信
      sendMessage(`ファイルをアップロードしました: ${file.name}`);
      
      // 入力欄をクリア
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    fileReader.readAsDataURL(file);
  }
  
  // 画像がアップロードされた時の処理
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileReader = new FileReader();
    
    fileReader.onload = (e) => {
      if (!e.target || typeof e.target.result !== 'string') return;
      
      // 新しい画像をアップロードリストに追加
      const newImage = {
        id: Date.now(),
        type: 'image',
        url: e.target.result,
        name: file.name
      };
      
      setUploadedFiles(prev => [...prev, newImage]);
      
      // 画像情報をメッセージとして送信
      sendMessage(`画像をアップロードしました: ${file.name}`);
      
      // 入力欄をクリア
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    };
    
    fileReader.readAsDataURL(file);
  }

  // マイク録音開始・停止処理
  const toggleRecording = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }
  
  // 録音開始処理
  const startRecording = () => {
    if (!isClient) return;
    
    try {
      // Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert('お使いのブラウザは音声認識をサポートしていません');
        return;
      }
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'ja-JP';
      recognitionInstance.interimResults = true;
      recognitionInstance.continuous = true;
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setInputMessage(transcript);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('音声認識エラー:', event.error);
        
        // エラータイプに基づいてユーザーフレンドリーなメッセージを表示
        let errorMessage = '音声認識エラーが発生しました。';
        
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'マイクへのアクセスが許可されていません。ブラウザの設定でマイクへのアクセスを許可してください。';
            break;
          case 'no-speech':
            errorMessage = '音声が検出されませんでした。もう一度お試しください。';
            break;
          case 'audio-capture':
            errorMessage = 'マイクが見つからないか、使用できません。マイクが正しく接続されているか確認してください。';
            break;
          case 'network':
            errorMessage = 'ネットワークエラーが発生しました。インターネット接続を確認してください。';
            break;
          case 'aborted':
            // ユーザーによって中止された場合はメッセージを表示しない
            break;
          default:
            // デフォルトのエラーメッセージ
        }
        
        // aborted以外のエラーの場合のみアラートを表示
        if (event.error !== 'aborted') {
          alert(errorMessage);
        }
        
        stopRecording();
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };
      
      // マイク許可を確認するためにnavigator.mediaDevicesを使用
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          // マイク許可が得られたので録音を開始
          recognitionInstance.start();
          setRecognition(recognitionInstance);
          setIsRecording(true);
        })
        .catch((err) => {
          console.error('マイクへのアクセスが拒否されました:', err);
          alert('マイクへのアクセスが拒否されました。ブラウザの設定でマイクの使用を許可してください。');
        });
      
    } catch (error) {
      console.error('音声認識の初期化に失敗しました:', error);
      alert('音声認識の初期化に失敗しました。サポートされているブラウザで再度お試しください。');
    }
  }
  
  // 録音停止処理
  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
      setIsRecording(false);
    }
  }

  // 設定メニューを表示する関数
  const handleShowSettings = () => {
    // 背景選択ダイアログを表示する
    const selectedBackground = prompt(
      `背景を選択してください（番号を入力）:\n${
        availableBackgrounds.map((bg, index) => `${index + 1}. ${bg.name}`).join('\n')
      }`
    );
    
    if (selectedBackground !== null) {
      const index = parseInt(selectedBackground) - 1;
      if (!isNaN(index) && index >= 0 && index < availableBackgrounds.length) {
        changeBackground(availableBackgrounds[index]);
      } else {
        alert('有効な選択ではありません。');
      }
    }
  }

  return (
    <>
      {showStartupAnimation && (
        <StartupAnimation onAnimationComplete={handleAnimationComplete} />
      )}
      
      {isLoggedIn && !showStartupAnimation && (
        <div className="flex h-screen w-full overflow-hidden bg-background">
          {/* モバイル用サイドバートグル */}
          {isMobile && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSidebar(true);
              }}
              className="absolute left-5 top-5 z-20 rounded-full bg-white/10 p-2.5 backdrop-blur-md transition hover:bg-white/20"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
          {/* ロゴのみのコラップス状態のサイドバー */}
          {!isMobile && isSidebarCollapsed && (
            <div 
              className="fixed left-5 top-5 z-30 cursor-pointer transition-all duration-300 bg-black overflow-hidden rounded-full"
              onClick={(e) => expandSidebar(e)}
              style={{ padding: 0, lineHeight: 0, fontSize: 0 }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-700/70 backdrop-blur-md transition hover:bg-gray-600/70">
                <SidebarIcon className="h-5 w-5 text-gray-200" />
              </div>
            </div>
          )}
          
          {/* サイドバー本体 - 収縮時は完全に非表示（モバイル以外） */}
          <div 
            className={`${
              isMobile 
                ? `fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${
                    showSidebar ? 'translate-x-0' : '-translate-x-full'
                  }`
                : `relative z-10 h-screen transition-all duration-300 ${
                    isSidebarCollapsed ? 'w-0 opacity-0 -translate-x-full' : 'w-[280px] opacity-100 translate-x-0'
                  }`
            }`}
          >
            <Sidebar 
              chatHistory={chatHistory}
              onNewChat={handleNewChat}
              onSelectChat={handleSelectChat}
              onDeleteChat={deleteChat}
              currentChatId={currentChatId}
              isMobile={isMobile}
              onClose={() => setShowSidebar(false)}
              isCollapsed={false} // サイドバー自体は常に展開状態
              onToggleCollapse={toggleSidebarCollapse}
              background={{ ...background, path: defaultBackgroundPath }}
              onShowSettings={handleShowSettings} // 設定メニューを表示する関数を渡す
            />
          </div>

          {/* メインコンテンツ - サイドバーの状態に応じた幅調整 */}
          <div 
            className="relative flex-1 flex flex-col items-center justify-center overflow-hidden transition-all duration-300"
            style={{ 
              width: `calc(100% - ${!isMobile && !isSidebarCollapsed ? sidebarWidth : 0}px)`,
              marginLeft: isMobile || isSidebarCollapsed ? 0 : 'auto',
              paddingLeft: !isMobile && isSidebarCollapsed ? '60px' : '0'  // ロゴの余白
            }}
          >
            {/* Background Image - 選択された背景を使用 */}
            <Image
              src={defaultBackgroundPath}
              alt="Background"
              fill
              className="object-cover"
              priority
            />

            {/* Background gradients - reduced opacity */}
            <div
              className="absolute -top-40 left-0 right-0 h-[500px] opacity-30"
              style={{
                background:
                  "linear-gradient(90deg, rgba(131, 58, 180, 0.5) 0%, rgba(253, 29, 29, 0.5) 50%, rgba(252, 176, 69, 0.5) 100%)",
                filter: "blur(100px)",
              }}
            />

            {/* Chat container - すりガラス効果を強化 */}
            <div className="relative z-10 flex h-[calc(100vh-20px)] w-[98%] max-w-7xl flex-col overflow-hidden rounded-2xl bg-white/40 backdrop-blur-md m-2.5 border border-gray-200/20 shadow-lg">
              {/* Chat header */}
              <div className="flex items-center justify-between border-b border-gray-200/20 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black overflow-hidden">
                    <Image
                      src="/logo.jpg"
                      alt="GOLD RUSH AGENT"
                      width={40}
                      height={40}
                      className="block"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">GOLD RUSH AGENT</h2>
                    <p className="text-xs text-gray-600">オンライン</p>
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {showMarketAgents ? (
                  <MarketAgentsUI query={marketQuery} onBack={() => setShowMarketAgents(false)} />
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            message.role === "user"
                              ? "bg-blue-500/80 text-white border border-blue-400/20 shadow-md"
                              : "bg-gray-100/70 text-gray-800 border border-gray-300/20 shadow-md"
                          }`}
                        >
                          <div className="mb-1">
                            {message.content}
                            
                            {/* アップロードされたファイルがある場合、表示する */}
                            {message.role === "user" && 
                             message.content.startsWith("ファイルをアップロードしました:") && 
                             uploadedFiles.find(f => f.type === 'file' && message.content.includes(f.name)) && (
                              <div className="mt-2 flex items-center gap-2 p-2 rounded-md bg-blue-600/50 border border-white/10">
                                <File className="h-5 w-5" />
                                <span className="text-sm">{message.content.replace("ファイルをアップロードしました: ", "")}</span>
                              </div>
                            )}
                            
                            {/* アップロードされた画像がある場合、表示する */}
                            {message.role === "user" && 
                             message.content.startsWith("画像をアップロードしました:") && 
                             uploadedFiles.find(f => f.type === 'image' && message.content.includes(f.name)) && (
                              <div className="mt-2">
                                <p className="text-sm mb-1">{message.content.replace("画像をアップロードしました: ", "")}</p>
                                <div className="relative w-full h-[150px] rounded-md overflow-hidden">
                                  <Image 
                                    src={uploadedFiles.find(f => f.type === 'image' && message.content.includes(f.name))?.url || ""}
                                    alt="Uploaded image"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-right text-xs text-gray-600">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* エラーメッセージのみ残す */}
                    {error && (
                      <div className="mb-4 flex justify-center">
                        <div className="max-w-[70%] rounded-2xl bg-red-100/70 px-4 py-2 text-red-800 border border-red-300/20 shadow-md">
                          <p>エラー: {error}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Chat input - すりガラス効果を強化 */}
              <div className="border-t border-gray-200/20 bg-white/40 p-4 backdrop-blur-md">
                <div className="flex items-center rounded-full bg-gray-100/50 px-4 py-2 backdrop-blur-sm border border-gray-300/20 shadow-inner">
                  <button 
                    onClick={(e) => handleFileClick(e)}
                    className="mr-2 text-gray-500 hover:text-gray-800"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  {/* 隠しファイル入力フィールド */}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.zip,.rar,.xls,.xlsx,.ppt,.pptx"
                  />
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="メッセージを入力..."
                    className="mr-2 flex-1 resize-none bg-transparent outline-none placeholder:text-gray-500 text-gray-800"
                    rows={1}
                    disabled={isLoading || isRecording}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleImageClick(e)}
                      className="text-gray-500 hover:text-gray-800"
                      disabled={isRecording}
                    >
                      <ImageIcon className="h-5 w-5" />
                    </button>
                    {/* 隠し画像入力フィールド */}
                    <input 
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <button 
                      onClick={toggleRecording}
                      className={`relative rounded-full p-2 transition-colors ${
                        isRecording 
                          ? "bg-red-500/80 text-white hover:bg-red-600/90 border border-red-400/20" 
                          : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/40"
                      }`}
                    >
                      <Mic className="h-5 w-5" />
                      {isRecording && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                        </span>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className={`rounded-full ${
                        isLoading 
                          ? "bg-blue-500/50 cursor-not-allowed" 
                          : "bg-blue-500/80 hover:bg-blue-600/90"
                      } p-2 text-white border border-blue-400/20 shadow-md`}
                      disabled={isLoading || isRecording}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {isRecording && (
                  <div className="mt-2 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-100/70 px-3 py-1 text-xs text-red-800 border border-red-300/20">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                      <span>音声を認識中... マイクボタンをクリックして終了</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Assistant popup - すりガラス効果を強化 */}
            {showAIPopup && (
              <div className="react-draggable absolute bottom-28 right-8 z-20 w-[320px] rounded-xl bg-white/40 p-4 shadow-lg backdrop-blur-md border border-gray-200/20">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/70 border border-indigo-400/20">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">GOLDRUSHエージェント</h3>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowAIPopup(false);
                    }}
                    className="rounded-full hover:bg-gray-200/50 text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="text-sm text-gray-800">{typedText}</div>
                {typedText.length === "私たちで日本を変えるビジネスを共創しましょう！".length && (
                  <div className="mt-2 flex justify-end gap-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowAIPopup(false);
                      }} 
                      className="rounded-md bg-gray-100/50 px-3 py-1 text-xs backdrop-blur-sm transition hover:bg-gray-200/60 text-gray-800 border border-gray-300/20"
                    >
                      いいえ
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNewChat();
                        setShowAIPopup(false);
                      }} 
                      className="rounded-md bg-blue-500/70 px-3 py-1 text-xs transition hover:bg-blue-600/80 text-white border border-blue-400/20"
                    >
                      はい
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* モバイル用オーバーレイ */}
          {isMobile && showSidebar && (
            <div 
              className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSidebar(false);
              }}
            />
          )}
        </div>
      )}
    </>
  )
}

function MarketAgentsUI({ query, onBack }: { query: string, onBack: () => void }) {
  // 進捗率
  const targetProgress = [100, 100, 100, 100];
  const agentResults = [
    // トレンド分析エージェント
    `市場規模は2024年で約1兆円、前年比+8%。消費者のAI活用意欲が高まっており、特にB2B分野での導入が加速。主要セグメントは製造・金融・医療。\n\n近年、AI技術の進化により、従来の業務プロセスが大幅に効率化されている。特に生成AIの普及により、企業のデータ活用が加速し、意思決定のスピードが向上。消費者側では、パーソナライズされたサービスへの期待が高まっており、AIチャットボットやレコメンドエンジンの利用率が上昇している。\n\n今後は、IoTや5Gとの連携によるリアルタイムデータ解析の需要が拡大し、AIを活用した新規ビジネスモデルの創出が期待される。規模拡大とともに、データガバナンスやセキュリティ対策の重要性も増している。`,
    // 競合調査エージェント
    `主要競合はA社・B社・C社。A社はシェア35%でリード、B社は独自アルゴリズムで差別化。C社は価格競争力が強み。新規参入はAPI連携やUXで差別化が必要。\n\nA社は大手企業との提携を強化し、エンタープライズ向けソリューションを拡充。B社は研究開発投資を増やし、特許取得数で業界トップ。C社は海外展開を積極化し、アジア市場でのプレゼンスを拡大している。\n\n競合各社はAI倫理や透明性にも注力しており、説明可能なAI（XAI）の導入が進む。今後は、エコシステム構築やパートナーシップ戦略が競争力の鍵となる。`,
    // 法規制監視エージェント
    `AI分野は法規制が流動的。2024年4月に新ガイドライン施行。個人情報保護・説明責任・倫理規定が強化。海外展開時は各国規制への適応が必須。\n\n欧州ではAI規制法案（AI Act）が審議中であり、リスクベースアプローチが導入される見込み。米国では州ごとに規制が異なり、企業は柔軟な対応が求められる。\n\n日本国内でもAIガバナンスの枠組みが整備されつつあり、企業は社内規程や教育体制の強化が必要。AI倫理審査委員会の設置や第三者認証の取得が推奨されている。`,
    // 研究動向エージェント
    `生成AI・自律型AIの研究が活発。日本発の論文数は前年比+12%。産学連携やオープンソース化が進展。特に自然言語処理・画像認識分野で革新が多い。\n\n2023年以降、マルチモーダルAIや強化学習の応用範囲が拡大。国内外の大学・研究機関が共同研究を推進し、国際会議での発表件数も増加。\n\n今後は、AIの社会実装や倫理的課題への対応が重要視される。AI人材育成や産業界との連携強化が、技術革新の持続的発展に寄与する見通し。`
  ];
  const agents = [
    {
      name: "トレンド分析エージェント",
      color: "#3CB4FF",
      percent: targetProgress[0],
      label: "市場トレンド・消費者行動の変化を予測",
      code: `iport pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.ensemble import RandomForestRegressor`,
      result: agentResults[0]
    },
    {
      name: "競合調査エージェント",
      color: "#C084FC",
      percent: targetProgress[1],
      label: "競合企業の戦略・製品を解析",
      code: `import axios from 'axios';\nimport * as d3 from 'd3';\nimport { CompetitorAnalyzer, MarketShare } from '../analytics/market-analyze'`,
      result: agentResults[1]
    },
    {
      name: "法規制監視エージェント",
      color: "#FFA726",
      percent: targetProgress[2],
      label: "関連法規制の動向をモニタリング",
      code: `#!/bin/bash\n# 法令スキャン: 法令スキャン映像\n# 使用方法: ./regultry_analysis.sh [原] [地域/頻度]`,
      result: agentResults[2]
    },
    {
      name: "研究動向エージェント",
      color: "#34D399",
      percent: targetProgress[3],
      label: "最先端研究・技術革新を追跡",
      code: `import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport seaborn as sns\nfrom typing import List, Tuple, Optional, Union`,
      result: agentResults[3]
    },
  ];

  // 各エージェントごとにprogressとresultTextの状態を持つ
  const [progress, setProgress] = useState([0, 0, 0, 0]);
  const [typedResults, setTypedResults] = useState(["", "", "", ""]);
  const [fadeOut, setFadeOut] = useState(false);
  const [showPatents, setShowPatents] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // progressを100%までアニメーション
    const intervals = agents.map((_, idx) => setInterval(() => {
      setProgress(prev => prev.map((p, i) => i === idx ? Math.min(p + 10, 100) : p));
    }, 160));
    // 100%到達後にタイピングアニメーション
    progress.forEach((p, idx) => {
      if (p === 100 && typedResults[idx].length === 0) {
        let i = 0;
        const text = agents[idx].result;
        const typeInterval = setInterval(() => {
          setTypedResults(prev => prev.map((t, j) => j === idx ? text.slice(0, i + 1) : t));
          i++;
          if (i >= text.length) clearInterval(typeInterval);
        }, 18);
      }
    });
    return () => intervals.forEach(clearInterval);
  }, [progress, typedResults]);

  // 全ての分析テキストが表示完了したら1秒後にfadeOut
  useEffect(() => {
    const allDone = typedResults.every((t, idx) => t.length === agents[idx].result.length);
    if (allDone) {
      const timer = setTimeout(() => setFadeOut(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [typedResults]);

  // フェードアウト後にローディング画面→特許ギャラリー表示
  const handleTransitionEnd = () => {
    if (fadeOut && !showLoading && !showPatents) {
      setShowLoading(true);
      setTimeout(() => {
        setShowLoading(false);
        setShowPatents(true);
      }, 4000);
    }
  };

  if (showLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center px-2 py-8 animate-fadein-scale">
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .loader {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #e879f9;
            border-right: 8px solid #818cf8;
            border-radius: 50%;
            width: 88px;
            height: 88px;
            animation: spin 1s cubic-bezier(0.22, 1, 0.36, 1) infinite;
            margin-bottom: 48px;
            box-shadow: 0 0 48px #f472b6, 0 0 16px #818cf8;
          }
        `}</style>
        <div className="loader" />
        <div className="text-4xl font-extrabold text-gray-800 tracking-wide bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-4" style={{letterSpacing:'0.08em'}}>ローディング中</div>
        <div className="text-4xl text-gray-700 font-extrabold tracking-wide drop-shadow-lg">市場分析データから特許を抽出中</div>
      </div>
    );
  }

  if (showPatents) {
    return <PatentGallery />;
  }

  return (
    <div
      className={`min-h-[400px] flex flex-col items-center justify-center px-2 py-8 transition-opacity duration-700 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="w-full max-w-5xl mb-6 flex items-center gap-3">
        <button onClick={onBack} className="rounded-full bg-white/70 px-5 py-2 text-gray-700 text-lg font-bold shadow border border-gray-200 hover:bg-gray-100 transition">← 戻る</button>
        <span className="text-2xl font-bold text-gray-800 tracking-wide flex items-center gap-2">
          <span>分析クエリ: <span className="font-mono text-indigo-500">{query}</span></span>
        </span>
      </div>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent, idx) => (
          <div key={agent.name} className="rounded-2xl bg-white/30 backdrop-blur-md shadow p-6 flex flex-col border border-gray-100 min-h-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-lg text-gray-800">{agent.name}</span>
            </div>
            <div className="text-gray-600 text-sm mb-2">{agent.label}</div>
            <div className="bg-gray-900 text-xs text-white rounded-md p-2 font-mono mb-2 overflow-x-auto min-h-[60px]">
              <pre className="whitespace-pre-wrap">{agent.code}</pre>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
              <div style={{ width: `${progress[idx]}%`, background: agent.color }} className="h-full transition-all duration-200" />
            </div>
            <div className="text-right text-xs text-gray-500">{progress[idx]}%</div>
            <div className="text-xs text-gray-400 mt-1 min-h-[2em]">分析中...</div>
            {progress[idx] === 100 && (
              <div className="mt-4 text-base text-black font-semibold leading-relaxed min-h-[90px] animate-fadein border-t border-gray-200 pt-3">
                {typedResults[idx]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PatentGallery() {
  const patents = [
    {
      title: "システム",
      inventor: "田中一郎",
      applicant: "ソフトバンクグループ株式会社",
      agent: "弁理士法人酒井国際特許事務所",
      publicationType: "公開公報",
      publicationNumber: "特開2023-153684",
      applicationNumber: "特願2025-045703",
      filingDate: "2023年09月20日",
      publicationDate: "2025年04月02日",
      summary: "【課題】本発明は、生成AIによる作品とクリエイターの作品を区別し、それぞれに適切な評価と価値を与えることを目的とする。\n【解決手段】生成AIによる作品とクリエイターの作品を区別するための手段と、生成AIによる作品を楽しむための手段と、クリエイターの作品を評価するための手段を含むシステム。",
      claim: "生成AIによる作品とクリエイターの作品を区別するための手段と、生成AIによる作品を楽しむための手段と、クリエイターの作品を評価するための手段を含むシステム。",
      ipc: "G06Q 50/10",
      fi: "G06Q50/10",
      fterm: ["5L049CC11", "5L050CC11"],
      citation: { title: "ペルソナチャットボット制御方法及びシステム", number: "特開2021-210522", applicant: "ネイバーコーポレーション" },
      match: 72
    },
    {
      title: "AI医療診断支援システム",
      inventor: "山田太郎",
      applicant: "メディカルAI株式会社",
      agent: "弁理士法人未来特許事務所",
      publicationType: "公開公報",
      publicationNumber: "特開2024-112233",
      applicationNumber: "特願2024-112233",
      filingDate: "2024年01月15日",
      publicationDate: "2025年06月10日",
      summary: "【課題】医療画像診断におけるAIの精度向上と診断時間の短縮を実現する。\n【解決手段】深層学習モデルを用いて医療画像を解析し、異常検知・診断結果を自動生成するシステム。医師の診断支援を目的とし、診断レポートの自動作成機能を備える。",
      claim: "医療画像をAIで解析し、異常検知・診断結果を自動生成するための手段と、診断レポートを自動作成するための手段を含むシステム。",
      ipc: "G06F 19/00",
      fi: "G06F19/00",
      fterm: ["5B123AA11", "5B124BB22"],
      citation: { title: "AI画像診断装置", number: "特開2022-334455", applicant: "AIメディカルソリューションズ" },
      match: 90
    },
    {
      title: "AI創薬プラットフォーム",
      inventor: "佐藤花子",
      applicant: "ファーマAI株式会社",
      agent: "弁理士法人創薬国際特許事務所",
      publicationType: "公開公報",
      publicationNumber: "特開2023-998877",
      applicationNumber: "特願2023-998877",
      filingDate: "2023年11月30日",
      publicationDate: "2025年03月15日",
      summary: "【課題】新薬候補分子の探索・評価をAIで効率化し、創薬プロセスの短縮とコスト削減を実現する。\n【解決手段】AIによる分子構造解析と活性予測、候補化合物の自動評価・ランキング機能を備えた創薬支援プラットフォーム。",
      claim: "分子構造をAIで解析し、活性予測・自動評価を行うための手段を含む創薬支援プラットフォーム。",
      ipc: "C07D 401/12",
      fi: "C07D401/12",
      fterm: ["5C789DD33", "5C790EE44"],
      citation: { title: "AI分子設計システム", number: "特開2021-556677", applicant: "バイオAIテクノロジーズ" },
      match: 67
    }
  ];
  const [currentIndex, setCurrentIndex] = useState(1); // 最初は真ん中
  const [showTalentLoading, setShowTalentLoading] = useState(false);
  const [showTalent, setShowTalent] = useState(false);
  const getIndex = (offset: number) => (currentIndex + offset + patents.length) % patents.length;

  // 「この特許を選択」ボタン押下時の処理
  const handleSelectPatent = () => {
    setShowTalentLoading(true);
    setTimeout(() => {
      setShowTalentLoading(false);
      setShowTalent(true);
    }, 4000);
  };

  // 特許カードをクリックした時の処理
  const handlePatentClick = (targetIndex: number) => {
    setCurrentIndex(targetIndex);
  };

  if (showTalentLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center px-2 py-8 animate-fadein-scale">
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .loader {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #e879f9;
            border-right: 8px solid #818cf8;
            border-radius: 50%;
            width: 88px;
            height: 88px;
            animation: spin 1s cubic-bezier(0.22, 1, 0.36, 1) infinite;
            margin-bottom: 48px;
            box-shadow: 0 0 48px #f472b6, 0 0 16px #818cf8;
          }
        `}</style>
        <div className="loader" />
        <div className="text-4xl font-extrabold text-gray-800 tracking-wide bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-4" style={{letterSpacing:'0.08em'}}>タレントマネジメント実行中</div>
      </div>
    );
  }

  if (showTalent) {
    return <TalentManagement />;
  }

  return (
    <>
      <style>{`
        @keyframes fadein-scale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-in {
          0% { transform: translateX(100%) scale(0.8) rotate(5deg); opacity: 0; }
          100% { transform: translateX(0) scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes slide-out {
          0% { transform: translateX(0) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translateX(-100%) scale(0.8) rotate(-5deg); opacity: 0; }
        }
        .animate-fadein-scale {
          animation: fadein-scale 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .patent-card {
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          backdrop-filter: blur(8px);
          transform-origin: center center;
        }
        .patent-card.active {
          transform: scale(1.05) translateY(-10px);
          z-index: 10;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .patent-card.inactive {
          opacity: 0.6;
          transform: scale(0.95);
        }
        .patent-card:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .patent-card.active:hover {
          transform: scale(1.07) translateY(-10px);
        }
        .patent-card.slide-in {
          animation: slide-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .patent-card.slide-out {
          animation: slide-out 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .match-rate {
          position: relative;
          padding-top: 1rem;
          margin-top: auto;
          text-align: center;
          border-top: 2px solid rgba(0,0,0,0.1);
        }
        .gallery-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .patent-title {
          text-align: center;
          margin-bottom: 1.5rem;
          position: relative;
        }
        .patent-title::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 3px;
          background: linear-gradient(to right, #3B82F6, #EC4899);
          border-radius: 3px;
        }
      `}</style>
      <div className="min-h-[600px] flex flex-col items-center justify-center px-2 py-12 animate-fadein-scale gallery-container rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold mb-12 tracking-wide drop-shadow-lg bg-gradient-to-r from-blue-500 via-pink-400 to-purple-500 bg-clip-text text-transparent text-center" style={{letterSpacing:'0.08em'}}>AI×医療 特許ギャラリー</h2>
        
        {/* 特許カードのコンテナ */}
        <div className="relative flex items-center justify-center w-full gap-8 mb-8">
          {/* 特許カード */}
          <div className="flex items-center justify-center gap-8">
            {[-1, 0, 1].map((offset) => {
              const index = getIndex(offset);
              const patent = patents[index];
              return (
                <div
                  key={offset}
                  onClick={() => handlePatentClick(index)}
                  className={`patent-card flex flex-col bg-white/90 rounded-3xl shadow-2xl border-4 ${
                    offset === 0 ? 'border-pink-300/60 active' : 'border-gray-300/60 inactive'
                  } p-6 w-[400px] min-h-[600px]`}
                >
                  <div className="patent-title">
                    <div className="text-2xl font-bold text-gray-800 tracking-tight">{patent.title}</div>
                  </div>
                  <div className="text-lg font-semibold mb-4 text-gray-800">
                    発明者: {patent.inventor}
                  </div>
                  <div className="text-gray-700 text-base whitespace-pre-line mb-4">{patent.summary}</div>
                  <div className="text-sm text-gray-500 mb-2">出願人: {patent.applicant}</div>
                  <div className="text-sm text-gray-500 mb-2">公開番号: {patent.publicationNumber}</div>
                  <div className="text-sm text-gray-500 mb-2">出願日: {patent.filingDate}</div>
                  <div className="text-sm text-gray-500 mb-2">公開日: {patent.publicationDate}</div>
                  <div className="match-rate">
                    <div className="text-lg text-gray-600 mb-1">マッチ度</div>
                    <div className={`text-4xl font-bold ${offset === 0 ? 'text-pink-600' : 'text-gray-600'}`}>
                      {patent.match}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 選択ボタン */}
        <div className="w-full flex justify-center mt-8">
          <button
            onClick={handleSelectPatent}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 text-white text-xl font-bold shadow-lg border-2 border-pink-200 hover:scale-105 hover:from-pink-500 hover:to-purple-600 transition-all duration-200"
          >
            この特許を選択
          </button>
        </div>
      </div>
    </>
  );
}

function TalentManagement() {
  const [selectedTalent, setSelectedTalent] = useState<number | null>(null);
  const [isInternal, setIsInternal] = useState(true);
  const [selectedTalents, setSelectedTalents] = useState<{internal: number[], external: number[]}>({internal: [], external: []});

  // ダミーデータ
  const internalTalents = [
    { name: "佐藤健", dept: "研究開発部", desc: "AIアルゴリズムの開発責任者。画像認識・自然言語処理に精通。", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "鈴木花子", dept: "事業企画部", desc: "新規事業の立ち上げ経験多数。市場分析と戦略立案が得意。", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "田中太郎", dept: "営業部", desc: "医療業界向け営業のエキスパート。顧客との信頼関係構築が強み。", img: "https://randomuser.me/api/portraits/men/65.jpg" },
    { name: "伊藤美咲", dept: "マーケティング部", desc: "デジタルマーケティングのスペシャリスト。SNS戦略に強い。", img: "https://randomuser.me/api/portraits/women/50.jpg" },
    { name: "小林直樹", dept: "システム部", desc: "インフラ構築とセキュリティ管理のエキスパート。", img: "https://randomuser.me/api/portraits/men/77.jpg" },
  ];
  const externalTalents = [
    { name: "山本美咲", dept: "外部コンサルタント", desc: "AI導入支援のプロフェッショナル。", img: null },
    { name: "高橋一生", dept: "特許事務所", desc: "知財・契約法務のスペシャリスト。", img: null },
    { name: "ジョン・スミス", dept: "海外パートナー", desc: "グローバル展開のアドバイザー。", img: null },
    { name: "李小龍", dept: "技術顧問", desc: "AI技術の国際的な専門家。", img: null },
  ];

  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center px-2 py-12 animate-fadein-scale gallery-container rounded-3xl shadow-2xl p-10">
      <h2 className="text-4xl font-extrabold mb-12 tracking-wide drop-shadow-lg bg-gradient-to-r from-blue-500 via-pink-400 to-purple-500 bg-clip-text text-transparent text-center" style={{letterSpacing:'0.08em'}}>タレントマネジメント</h2>
      <div className="flex flex-row w-full gap-12 items-stretch">
        {/* 社内セクション */}
        <div className="flex-1 flex flex-col relative">
          <div className="relative mb-8 flex justify-center">
            <h3 className="text-4xl font-bold text-gray-800 text-center relative inline-block">
              社内
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"></span>
            </h3>
          </div>
          <div className="flex flex-col gap-8 h-full backdrop-blur-sm bg-white/30 rounded-3xl p-8 border border-white/20">
            {internalTalents.map((t, i) => (
              <div 
                key={i} 
                onClick={() => {
                  setSelectedTalents(prev => {
                    const newInternal = [...prev.internal];
                    const index = newInternal.indexOf(i);
                    if (index === -1) {
                      newInternal.push(i);
                    } else {
                      newInternal.splice(index, 1);
                    }
                    return {...prev, internal: newInternal};
                  });
                }}
                className={`talent-card flex flex-row items-center bg-white/90 rounded-3xl shadow-2xl border-4 ${
                  selectedTalents.internal.includes(i) ? 'border-pink-400 shadow-lg scale-[1.02]' : 'border-pink-300/60'
                } p-6 min-h-[160px] h-full max-w-full hover:scale-[1.02] transition-all duration-300 cursor-pointer relative`}
              >
                {selectedTalents.internal.includes(i) && (
                  <div className="absolute -top-2 -right-2 bg-pink-500 rounded-full p-1 shadow-lg animate-bounce">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                )}
                {t.name === "佐藤健" ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden mr-4 border-4 border-pink-200 shadow bg-gray-100 flex items-center justify-center relative">
                    <Image
                      src="/sato-takeru.jpg"
                      alt={t.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="80px"
                    />
                  </div>
                ) : t.img ? (
                  <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full object-cover mr-4 border-4 border-pink-200 shadow" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold mr-4 border-4 border-pink-200 shadow">
                    No Image
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold text-gray-800 mb-1 tracking-tight">{t.name}</div>
                  <div className="text-lg text-pink-500 font-semibold mb-1">{t.dept}</div>
                  <div className="text-gray-700 text-base whitespace-pre-line">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 社外セクション */}
        <div className="flex-1 flex flex-col relative">
          <div className="relative mb-8 flex justify-center">
            <h3 className="text-4xl font-bold text-gray-800 text-center relative inline-block">
              社外
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></span>
            </h3>
          </div>
          <div className="flex flex-col gap-8 h-full backdrop-blur-sm bg-white/30 rounded-3xl p-8 border border-white/20">
            {externalTalents.map((t, i) => (
              <div 
                key={i} 
                onClick={() => {
                  setSelectedTalents(prev => {
                    const newExternal = [...prev.external];
                    const index = newExternal.indexOf(i);
                    if (index === -1) {
                      newExternal.push(i);
                    } else {
                      newExternal.splice(index, 1);
                    }
                    return {...prev, external: newExternal};
                  });
                }}
                className={`talent-card flex flex-row items-center bg-white/90 rounded-3xl shadow-2xl border-4 ${
                  selectedTalents.external.includes(i) ? 'border-blue-400 shadow-lg scale-[1.02]' : 'border-blue-300/60'
                } p-6 min-h-[160px] max-w-full hover:scale-[1.02] transition-all duration-300 cursor-pointer relative`}
              >
                {selectedTalents.external.includes(i) && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1 shadow-lg animate-bounce">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold mr-4 border-4 border-blue-200 shadow">
                  No Image
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800 mb-1 tracking-tight">{t.name}</div>
                  <div className="text-lg text-blue-500 font-semibold mb-1">{t.dept}</div>
                  <div className="text-gray-700 text-base whitespace-pre-line">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 選択されたタレントの詳細表示 */}
      {selectedTalent !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl border-4 border-pink-300/60">
            <div className="flex items-center gap-6 mb-6">
              {isInternal ? (
                <img 
                  src={internalTalents[selectedTalent].img} 
                  alt={internalTalents[selectedTalent].name} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-pink-200 shadow"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold border-4 border-blue-200 shadow">
                  No Image
                </div>
              )}
              <div>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">
                  {isInternal ? internalTalents[selectedTalent].name : externalTalents[selectedTalent].name}
                </h3>
                <p className="text-2xl text-pink-500 font-semibold">
                  {isInternal ? internalTalents[selectedTalent].dept : externalTalents[selectedTalent].dept}
                </p>
              </div>
            </div>
            <p className="text-xl text-gray-700 mb-6">
              {isInternal ? internalTalents[selectedTalent].desc : externalTalents[selectedTalent].desc}
            </p>
            <div className="flex justify-end">
              <button 
                onClick={() => setSelectedTalent(null)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white text-lg font-bold shadow-lg hover:scale-105 transition-transform duration-200"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 枠の高さを揃えるためのスタイル */}
      <style jsx>{`
        .talent-card {
          min-height: 160px;
          height: 100%;
          display: flex;
        }
      `}</style>
    </div>
  );
}
