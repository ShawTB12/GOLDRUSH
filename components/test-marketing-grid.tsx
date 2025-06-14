'use client';

import React, { useState, useEffect } from 'react';

// 検証項目のデータ（エージェント担当者情報を追加）
const verificationItems = [
  { id: 1, title: "財務健全性", description: "NPV・IRR・キャッシュフロー試算", agent: "財務分析AI", agentType: "金融エージェント" },
  { id: 2, title: "規制チェック", description: "薬機法／FDA SaMD区分確定", agent: "規制遵守AI", agentType: "法務エージェント" },
  { id: 3, title: "データプライバシー", description: "APPI・GDPR・HIPAA準拠", agent: "プライバシーAI", agentType: "セキュリティエージェント" },
  { id: 4, title: "環境規制", description: "CO₂排出・ESG障壁回避", agent: "ESG評価AI", agentType: "環境エージェント" },
  { id: 5, title: "撤退基準", description: "KPI未達時の損失最小撤収条件", agent: "リスク管理AI", agentType: "戦略エージェント" },
  { id: 6, title: "サプライチェーン", description: "部材調達性・代替ルート確保", agent: "調達最適化AI", agentType: "オペレーションエージェント" },
  { id: 7, title: "診断性能ベンチマーク", description: "感度・特異度の臨床優位性", agent: "医療統計AI", agentType: "メディカルエージェント" },
  { id: 8, title: "医療過誤・賠償責任リスク", description: "誤診責任範囲と保険評価", agent: "医療法務AI", agentType: "リーガルエージェント" },
  { id: 9, title: "多施設・外部コホート検証", description: "モデル汎化性能保証", agent: "臨床検証AI", agentType: "バリデーションエージェント" },
  { id: 10, title: "ユーザトレーニング要件", description: "医師・技師教育とCME単位化", agent: "教育設計AI", agentType: "エデュケーションエージェント" },
  { id: 11, title: "倫理委員会／IRB承認手続き", description: "臨床データ利用倫理確認", agent: "倫理審査AI", agentType: "エシックスエージェント" },
  { id: 12, title: "保守・DevOps体制負荷", description: "運用コスト・SLA維持算定", agent: "運用効率AI", agentType: "テクニカルエージェント" },
  { id: 13, title: "サイバーセキュリティ", description: "FDAガイドライン準拠セキュリティ", agent: "セキュリティAI", agentType: "セーフガードエージェント" },
  { id: 14, title: "アノテーションパイプライン拡張性", description: "半自動ラベル付け継続学習", agent: "機械学習AI", agentType: "MLOpsエージェント" },
  { id: 15, title: "スケーラビリティ設計", description: "クラウド／エッジ構成最適化", agent: "インフラAI", agentType: "アーキテクチャエージェント" },
  { id: 16, title: "ナレッジ蓄積", description: "構造化データ保存・再学習促進", agent: "知識管理AI", agentType: "ナレッジエージェント" },
];

interface TestMarketingGridProps {
  onBackToSlides?: () => void;
}

export default function TestMarketingGrid({ onBackToSlides }: TestMarketingGridProps = {}) {
  const [loadingStates, setLoadingStates] = useState<{[key: number]: {progress: number, completed: boolean}}>({});
  const [showContent, setShowContent] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [graphProgress, setGraphProgress] = useState(0);

  useEffect(() => {
    // 初期化
    const initialStates: {[key: number]: {progress: number, completed: boolean}} = {};
    verificationItems.forEach(item => {
      initialStates[item.id] = { progress: 0, completed: false };
    });
    setLoadingStates(initialStates);

    // 3秒後にローディング開始
    const startTimer = setTimeout(() => {
      verificationItems.forEach((item, index) => {
        const startDelay = index * 500; // 各カードを500ms遅延
        
        setTimeout(() => {
          const duration = 30000; // 30秒で完了
          const startTime = Date.now();
          
          const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            
            setLoadingStates(prev => ({
              ...prev,
              [item.id]: { 
                progress: progress,
                completed: progress >= 100
              }
            }));
            
            if (progress >= 100) {
              clearInterval(progressInterval);
            }
          }, 16); // 60fps更新
        }, startDelay);
      });
    }, 3000);

    // 全体コンテンツ表示
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  // カードクリックハンドラー（presentation-gridと同じパターン）
  const handleCardClick = (item: any, isLoading: boolean, isCompleted: boolean) => {
    console.log('Card clicked:', item.id, 'isLoading:', isLoading, 'isCompleted:', isCompleted, 'title:', item.title);
    
    if ((isLoading || isCompleted) && item.id === 1) { // 財務健全性のみ対応（分析中でも可）
      console.log('財務健全性カードの条件満たしました');
      if (expandedCardId === item.id) {
        // 同じカードをクリックした場合は縮小
        console.log('カードを閉じます');
        setExpandedCardId(null);
        setGraphProgress(0);
      } else {
        // 拡大表示
        console.log('カードを拡大表示します');
        setExpandedCardId(item.id);
        setGraphProgress(0);
        
        // グラフアニメーション開始
        setTimeout(() => {
          console.log('グラフアニメーション開始');
          const animationDuration = 3000; // 3秒
          const startTime = Date.now();
          
          const animateGraph = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / animationDuration) * 100, 100);
            setGraphProgress(progress);
            
            if (progress < 100) {
              requestAnimationFrame(animateGraph);
            }
          };
          
          animateGraph();
        }, 500); // 表示後0.5秒で開始
      }
    } else {
      console.log('条件を満たしていません。isLoading:', isLoading, 'isCompleted:', isCompleted, 'id:', item.id);
    }
  };

  // ホバー効果のスタイルを取得する関数
  const getCardStyle = (item: any, isLoading: boolean, isCompleted: boolean, index: number) => {
    const isHovered = hoveredCard === item.id;
    
    const baseStyle = {
      aspectRatio: '4/3',
      animationDelay: `${index * 0.1}s`,
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    };
    
    if (!isHovered) {
      return {
        ...baseStyle,
        transform: 'scale(1) translateY(0px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        zIndex: 1
      };
    }

    // ホバー時のスタイル
    if (isLoading) {
      return {
        ...baseStyle,
        transform: 'scale(1.12) translateY(-15px)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.25), 0 0 30px rgba(59, 130, 246, 0.3)',
        zIndex: 10
      };
    } else if (isCompleted) {
      return {
        ...baseStyle,
        transform: 'scale(1.1) translateY(-10px)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2), 0 0 25px rgba(16, 185, 129, 0.4)',
        zIndex: 10
      };
    } else {
      return {
        ...baseStyle,
        transform: 'scale(1.08) translateY(-12px)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
        zIndex: 10
      };
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadein-scale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-in-card {
          0% { transform: translateY(20px) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-fadein-scale {
          animation: fadein-scale 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .verification-card {
          cursor: pointer;
          backdrop-filter: blur(16px);
          transform-origin: center center;
          position: relative;
        }
        .verification-card.animate-in {
          animation: slide-in-card 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .gallery-container {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .verification-title {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }
        .verification-title::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: linear-gradient(to right, #3B82F6, #EC4899);
          border-radius: 3px;
        }
        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }
        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
      <div className="min-h-[600px] flex flex-col items-center justify-center px-2 py-12 animate-fadein-scale gallery-container rounded-3xl shadow-2xl p-10 relative">
        {/* 再実行ボタン */}
        {onBackToSlides && (
          <button
            onClick={onBackToSlides}
            className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg border-2 border-blue-300 hover:scale-110 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 z-50"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            再実行
          </button>
        )}
        
        {/* ヘッダー */}
        <div className="verification-title">
          <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-lg bg-gradient-to-r from-blue-500 via-pink-400 to-purple-500 bg-clip-text text-transparent" style={{letterSpacing:'0.08em'}}>
            CancerBridge テストマーケティング検証
          </h1>
          <p className="text-gray-100 text-lg mt-4">
            ソフトバンク経済圏での実現可能性を多角的に検証
          </p>
        </div>

        {/* 4×4 グリッド */}
        <div className={`grid grid-cols-4 gap-6 max-w-7xl mx-auto ${expandedCardId !== null ? 'pointer-events-none opacity-50' : ''}`}>
          {verificationItems.map((item, index) => {
            const loadingState = loadingStates[item.id] || { progress: 0, completed: false };
            const isLoading = loadingState.progress > 0 && !loadingState.completed;
            const isCompleted = loadingState.completed;
            
            return (
              <div
                key={item.id}
                className={`verification-card animate-in bg-white/90 rounded-3xl shadow-2xl border-4 border-pink-300/60 p-6 relative ${
                  isLoading ? 'loading cursor-pointer' : isCompleted ? 'completed cursor-pointer' : ''
                } ${(isLoading || isCompleted) && item.id === 1 ? 'hover:border-blue-400/80' : ''}`}
                style={getCardStyle(item, isLoading, isCompleted, index)}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleCardClick(item, isLoading, isCompleted)}
              >
                {/* ローディングオーバーレイ */}
                {(isLoading || isCompleted) && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-3xl flex items-center justify-center z-20 pointer-events-none">
                    <div className="flex flex-col items-center text-center px-8 py-6">
                      {/* 円形プログレスバー - さらに小さく */}
                      <div className="relative w-20 h-20 mb-3">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          {/* 背景サークル */}
                          <circle 
                            className="opacity-20" 
                            strokeWidth="5" 
                            stroke="#E5E7EB" 
                            fill="none" 
                            r="35" 
                            cx="50" 
                            cy="50" 
                          />
                          
                          {/* グラデーション定義 */}
                          <defs>
                            <linearGradient id={`progressGradient${item.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#3B82F6" />
                              <stop offset="50%" stopColor="#EC4899" />
                              <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                          </defs>
                          
                          {/* プログレスサークル */}
                          <circle 
                            strokeWidth="5" 
                            stroke={`url(#progressGradient${item.id})`}
                            fill="none" 
                            r="35" 
                            cx="50" 
                            cy="50" 
                            strokeDasharray="219.9" 
                            strokeDashoffset={219.9 - (219.9 * loadingState.progress) / 100}
                            strokeLinecap="round"
                            style={{ 
                              transition: 'stroke-dashoffset 0.1s ease-out',
                              transform: 'rotate(-90deg)',
                              transformOrigin: '50% 50%'
                            }}
                          />
                        </svg>
                        
                        {/* 中央のコンテンツ */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          {isCompleted ? (
                            // シンプルな完了表示
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            // パーセンテージ
                            <span className="text-lg font-bold bg-gradient-to-r from-blue-500 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                              {Math.round(loadingState.progress)}%
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* エージェント情報 */}
                      {!isCompleted && (
                        <div className="mb-2">
                          <div className="text-xs font-semibold text-blue-600 mb-1">
                            {item.agentType}
                          </div>
                          <div className="text-sm font-bold text-gray-800">
                            {item.agent}
                          </div>
                        </div>
                      )}
                      
                      {/* ステータステキスト */}
                      <p className="text-sm font-bold text-gray-700">
                        {isCompleted ? '検証完了' : '検証実行中...'}
                      </p>
                      
                      {/* 追加の詳細情報 */}
                      {!isCompleted && (
                        <p className="text-xs text-gray-500 mt-1 leading-tight">
                          {item.title}を分析中
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* トップアクセントライン */}
                <div className="w-full h-1 rounded-full mb-4" style={{
                  background: 'linear-gradient(to right, #3B82F6, #EC4899)'
                }}></div>
                
                {/* 番号タグ */}
                <div className="inline-block px-3 py-1 text-xs font-bold tracking-wider mb-3 rounded-full" style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                  color: '#EC4899',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}>
                  #{String(item.id).padStart(2, '0')}
                </div>
                
                {/* カード内容 */}
                <div className={`relative z-10 transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-70'}`}>
                  {/* タイトル */}
                  <h3 className="text-xl font-bold mb-3 leading-tight text-gray-800">
                    {item.title}
                  </h3>
                  
                  {/* 説明 */}
                  <p className="text-sm leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* F/M比率分析拡大表示（presentation-gridと同じパターン） */}
        {expandedCardId === 1 && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
            onClick={() => setExpandedCardId(null)}
          >
            <div 
              className="relative w-5/6 h-5/6 max-w-6xl rounded-lg shadow-2xl overflow-hidden bg-black/80 backdrop-blur-lg border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 拡大されたコンテンツ */}
              <div className="w-full h-full p-8 overflow-auto">
                {/* ヘッダー */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      財務健全性 - 詳細分析
                    </h2>
                    <p className="text-white/80 mt-2">F/M比率（売上高/固定資産比率）のリアルタイム分析</p>
                  </div>
                  <button 
                    onClick={() => setExpandedCardId(null)}
                    className="text-white/60 hover:text-white text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* グラフエリア */}
                <div className="bg-white/5 rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Cancer Bridge - 包括的財務分析</h3>
                  
                  {/* 複合グラフエリア */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* F/M比率トレンド */}
                    <div className="relative h-64 bg-gray-900/30 rounded-xl p-4">
                      <h4 className="text-sm text-white/80 mb-2">診断収益効率性 (F/M比率)</h4>
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        <defs>
                          <linearGradient id="fmGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="50%" stopColor="#EC4899" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                          </linearGradient>
                        </defs>
                        
                        {/* Y軸グリッド */}
                        {[0, 1, 2, 3, 4].map(i => (
                          <g key={i}>
                            <line x1="40" y1={30 + i * 30} x2="360" y2={30 + i * 30} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                            <text x="35" y={35 + i * 30} fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="end">
                              {4 - i}
                            </text>
                          </g>
                        ))}
                        
                        {/* X軸ラベル */}
                        {['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'].map((quarter, i) => (
                          <text key={i} x={60 + i * 50} y="190" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="middle">
                            {quarter}
                          </text>
                        ))}

                        {/* F/M比率ライン */}
                        <path
                          d={`M 60,${150 - (2.1 * 30)} L ${60 + (graphProgress/100) * 50},${150 - (2.3 * 30)} L ${60 + (graphProgress/100) * 100},${150 - (2.8 * 30)} L ${60 + (graphProgress/100) * 150},${150 - (3.2 * 30)} L ${60 + (graphProgress/100) * 200},${150 - (3.5 * 30)} L ${60 + (graphProgress/100) * 250},${150 - (3.8 * 30)}`}
                          stroke="url(#fmGradient)"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          style={{
                            strokeDasharray: '500',
                            strokeDashoffset: 500 - (graphProgress / 100) * 500,
                            transition: 'stroke-dashoffset 0.1s ease-out'
                          }}
                        />
                      </svg>
                    </div>

                    {/* コスト構造分析 */}
                    <div className="relative h-64 bg-gray-900/30 rounded-xl p-4">
                      <h4 className="text-sm text-white/80 mb-2">医療AI開発コスト構造</h4>
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        <defs>
                          <linearGradient id="costGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#EF4444" />
                            <stop offset="100%" stopColor="#DC2626" />
                          </linearGradient>
                          <linearGradient id="costGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#F97316" />
                            <stop offset="100%" stopColor="#EA580C" />
                          </linearGradient>
                          <linearGradient id="costGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#EAB308" />
                            <stop offset="100%" stopColor="#CA8A04" />
                          </linearGradient>
                          <linearGradient id="costGradient4" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#22C55E" />
                            <stop offset="100%" stopColor="#16A34A" />
                          </linearGradient>
                        </defs>
                        
                        {/* コスト積み上げバー */}
                        {['人件費', 'データ費', 'インフラ', '規制対応'].map((cost, i) => {
                          const maxHeight = 120;
                          const costRatios = [0.4, 0.3, 0.2, 0.1]; // 40%, 30%, 20%, 10%
                          const currentHeight = maxHeight * costRatios[i] * (graphProgress / 100);
                          const yPosition = 150 - (i > 0 ? costRatios.slice(0, i).reduce((a, b) => a + b, 0) * maxHeight * (graphProgress / 100) : 0) - currentHeight;
                          
                          return (
                            <g key={i}>
                              <rect
                                x="150"
                                y={yPosition}
                                width="100"
                                height={currentHeight}
                                fill={`url(#costGradient${i + 1})`}
                                opacity="0.9"
                              />
                              {graphProgress > 20 * (i + 1) && (
                                <text
                                  x="280"
                                  y={yPosition + currentHeight / 2 + 3}
                                  fill="white"
                                  fontSize="12"
                                  fontWeight="bold"
                                >
                                  {cost}
                                </text>
                              )}
                            </g>
                          );
                        })}
                        
                        {/* Y軸ラベル */}
                        <text x="20" y="25" fill="rgba(255,255,255,0.8)" fontSize="10">億円</text>
                        <text x="20" y="40" fill="rgba(255,255,255,0.6)" fontSize="10">15</text>
                        <text x="20" y="70" fill="rgba(255,255,255,0.6)" fontSize="10">10</text>
                        <text x="20" y="100" fill="rgba(255,255,255,0.6)" fontSize="10">5</text>
                        <text x="20" y="150" fill="rgba(255,255,255,0.6)" fontSize="10">0</text>
                      </svg>
                    </div>
                  </div>

                  {/* ROI分析とアノテーション効率 */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* ROI分析 */}
                    <div className="relative h-64 bg-gray-900/30 rounded-xl p-4">
                      <h4 className="text-sm text-white/80 mb-2">診断精度向上ROI</h4>
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        <defs>
                          <linearGradient id="roiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>
                        </defs>
                        
                        {/* ROI曲線 */}
                        <path
                          d={`M 40,160 Q ${40 + (graphProgress/100) * 100},${160 - (graphProgress/100) * 0.8} ${40 + (graphProgress/100) * 320},${40 + (graphProgress/100) * 0.2}`}
                          stroke="url(#roiGradient)"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          style={{
                            strokeDasharray: '800',
                            strokeDashoffset: 800 - (graphProgress / 100) * 800,
                            transition: 'stroke-dashoffset 0.1s ease-out'
                          }}
                        />
                        
                        {/* ROI値表示 */}
                        {graphProgress > 80 && (
                          <text x="320" y="50" fill="#10B981" fontSize="14" fontWeight="bold" textAnchor="end">
                            +247% ROI
                          </text>
                        )}
                      </svg>
                    </div>

                    {/* アノテーション効率 */}
                    <div className="relative h-64 bg-gray-900/30 rounded-xl p-4">
                      <h4 className="text-sm text-white/80 mb-2">データアノテーション効率化</h4>
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        {/* 円グラフ（アノテーション工数削減） */}
                        {graphProgress > 50 && (
                          <g>
                            <circle cx="200" cy="100" r="60" fill="rgba(255,255,255,0.1)" />
                            <path
                              d={`M 200,100 L 200,40 A 60,60 0 ${graphProgress > 75 ? 1 : 0},1 ${200 + 60 * Math.sin(2 * Math.PI * 0.7)},${100 - 60 * Math.cos(2 * Math.PI * 0.7)} Z`}
                              fill="#8B5CF6"
                              opacity="0.8"
                            />
                            <text x="200" y="100" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">
                              70%削減
                            </text>
                            <text x="200" y="115" fill="white" fontSize="10" textAnchor="middle">
                              アノテーション工数
                            </text>
                          </g>
                        )}
                      </svg>
                    </div>
                  </div>

                  {/* がん診断AI特化 分析結果 */}
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-blue-400">{graphProgress > 40 ? '3.8' : '---'}</div>
                      <div className="text-xs text-white/60">診断収益効率<br/>(F/M比率)</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-green-400">{graphProgress > 60 ? '94.7%' : '---'}</div>
                      <div className="text-xs text-white/60">がん検出精度<br/>(感度)</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-purple-400">{graphProgress > 80 ? '247%' : '---'}</div>
                      <div className="text-xs text-white/60">診断時間短縮<br/>ROI</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-orange-400">{graphProgress > 90 ? '70%' : '---'}</div>
                      <div className="text-xs text-white/60">アノテーション<br/>工数削減</div>
                    </div>
                  </div>
                </div>

                {/* がん診断AI特化 分析結果 */}
                <div className="bg-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-semibold">医療AI財務分析エージェント による包括分析</span>
                  </div>
                  <div className="text-white/80 leading-relaxed space-y-2">
                    {graphProgress > 30 && (
                      <p className="text-sm">
                        🏥 <strong>診断収益効率:</strong> F/M比率3.8により、医療機器投資に対する診断収益が業界平均(2.2)を73%上回る効率性を実現
                      </p>
                    )}
                    {graphProgress > 50 && (
                      <p className="text-sm">
                        📊 <strong>コスト構造最適化:</strong> 放射線科医人件費(40%)、医療データ取得(30%)、AI学習インフラ(20%)、薬機法対応(10%)のバランス良い配分
                      </p>
                    )}
                    {graphProgress > 70 && (
                      <p className="text-sm">
                        🎯 <strong>診断精度向上:</strong> 感度94.7%達成により誤診リスクを67%削減、医療過誤賠償コスト年間2.3億円の軽減効果
                      </p>
                    )}
                    {graphProgress > 90 && (
                      <p className="text-sm">
                        ⚡ <strong>スケールメリット:</strong> アノテーション自動化で人的コスト70%削減、診断1件あたりの限界コストが半減し、収益性の指数的向上が見込まれます
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 