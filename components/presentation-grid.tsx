'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";

interface SlideInfo {
  title: string;
  imagePath: string;
  codeAnimation: string;
  slideNumber: string;
}

const slides: SlideInfo[] = [
  {
    title: "表紙",
    imagePath: "/cancerbridge/表紙.png",
    slideNumber: "1 / 8",
    codeAnimation: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>新規事業創出計画</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
        }
        .slide {
            width: 1280px;
            min-height: 720px;
            position: relative;
            background-color: white;
            overflow: hidden;
            box-sizing: border-box;
            padding: 40px 60px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .slide-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1e40af;
        }
        .slide-number {
            font-size: 1.2rem;
            color: #666;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="slide cover">
        <div class="header">
            <h1 class="slide-title">新規事業創出計画</h1>
            <div class="slide-number">1 / 8</div>
        </div>
        <div class="content">
            <img src="logo.png" alt="会社ロゴ" class="mx-auto" />
            <p class="text-2xl text-center mt-8">2024年</p>
        </div>
    </div>
</body>
</html>`
  },
  {
    title: "新規事業で解消する社会課題",
    imagePath: "/cancerbridge/新規事業で解消する社会課題.png",
    slideNumber: "2 / 8",
    codeAnimation: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>課題認識：がん医療格差の現状</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
        }
        .slide {
            width: 1280px;
            min-height: 720px;
            position: relative;
            background-color: white;
            overflow: hidden;
            box-sizing: border-box;
            padding: 40px 60px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .slide-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1e40af;
        }
        .slide-number {
            font-size: 1.2rem;
            color: #666;
            font-weight: 500;
        }
        .chart-container {
            height: 320px;
            margin-bottom: 20px;
        }
        .insight-box {
            background-color: #f0f4ff;
            border-left: 5px solid #1e40af;
            padding: 15px 20px;
            margin-top: 20px;
        }
        .insight-title {
            font-weight: 700;
            color: #1e40af;
            font-size: 1.2rem;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="slide social-issues">
        <div class="header">
            <h1 class="slide-title">解消する社会課題</h1>
            <div class="slide-number">2 / 8</div>
        </div>
        <div class="content">
            <ul class="list-disc pl-5 text-lg space-y-4">
                <li>課題1: 人材不足</li>
                <li>課題2: 効率性の低下</li>
                <li>課題3: 情報格差</li>
            </ul>
            <div class="chart-container mt-6">
                <!-- チャートが入る場所 -->
            </div>
        </div>
    </div>
</body>
</html>`
  },
  {
    title: "ミッション・ビジョン",
    imagePath: "/cancerbridge/ミッション・ビジョン.png",
    slideNumber: "3 / 8",
    codeAnimation: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ミッションとビジョン</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
        }
        .slide {
            width: 1280px;
            min-height: 720px;
            position: relative;
            background-color: white;
            overflow: hidden;
            box-sizing: border-box;
            padding: 40px 60px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .slide-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1e40af;
        }
        .slide-number {
            font-size: 1.2rem;
            color: #666;
            font-weight: 500;
        }
        .mission-vision-container {
            display: flex;
            gap: 40px;
            margin-top: 40px;
        }
        .mission-box, .vision-box {
            flex: 1;
            border-radius: 8px;
            padding: 30px;
        }
        .mission-box {
            background-color: #ebf5ff;
            border: 1px solid #93c5fd;
        }
        .vision-box {
            background-color: #f0fdf4;
            border: 1px solid #86efac;
        }
        .box-title {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 20px;
            text-align: center;
        }
        .mission-box .box-title {
            color: #1e40af;
        }
        .vision-box .box-title {
            color: #15803d;
        }
    </style>
</head>
<body>
    <div class="slide mission-vision">
        <div class="header">
            <h1 class="slide-title">ミッション・ビジョン</h1>
            <div class="slide-number">3 / 8</div>
        </div>
        <div class="content">
            <div class="mission-vision-container">
                <div class="mission-box">
                    <h2 class="box-title">ミッション</h2>
                    <p class="text-xl text-center">テクノロジーの力で社会課題を解決</p>
                </div>
                <div class="vision-box">
                    <h2 class="box-title">ビジョン</h2>
                    <p class="text-xl text-center">2030年までに新たな価値創造</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
  },
  {
    title: "使用する特許",
    imagePath: "/cancerbridge/使用する特許.png",
    slideNumber: "4 / 8",
    codeAnimation: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>使用する特許技術</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
        }
        .slide {
            width: 1280px;
            min-height: 720px;
            position: relative;
            background-color: white;
            overflow: hidden;
            box-sizing: border-box;
            padding: 40px 60px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .slide-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1e40af;
        }
        .slide-number {
            font-size: 1.2rem;
            color: #666;
            font-weight: 500;
        }
        .patent-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
        }
        .patent-table th, .patent-table td {
            border: 1px solid #d1d5db;
            padding: 12px 15px;
            text-align: left;
        }
        .patent-table th {
            background-color: #f3f4f6;
            font-weight: 600;
            color: #1f2937;
        }
        .patent-table tr:nth-child(even) {
            background-color: #f9fafb;
        }
    </style>
</head>
<body>
    <div class="slide patents">
        <div class="header">
            <h1 class="slide-title">活用特許技術</h1>
            <div class="slide-number">4 / 8</div>
        </div>
        <div class="content">
            <table class="patent-table">
                <thead>
                    <tr>
                        <th>特許番号</th>
                        <th>技術概要</th>
                        <th>効果</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>P12345</td>
                        <td>AI最適化アルゴリズム</td>
                        <td>処理効率30%向上</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>`
  },
  {
    title: "差別化要素:競合比較",
    imagePath: "/cancerbridge/差別化要素:競合比較.png",
    slideNumber: "5 / 8",
    codeAnimation: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>競合分析と差別化要素</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
        }
        .slide {
            width: 1280px;
            min-height: 720px;
            position: relative;
            background-color: white;
            overflow: hidden;
            box-sizing: border-box;
            padding: 40px 60px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .slide-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1e40af;
        }
        .slide-number {
            font-size: 1.2rem;
            color: #666;
            font-weight: 500;
        }
        .comparison-chart {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-top: 40px;
        }
        .comparison-item {
            text-align: center;
            padding: 20px;
            border-radius: 8px;
        }
        .our-company {
            background-color: #dbeafe;
            border: 2px solid #3b82f6;
        }
        .competitor {
            background-color: #f3f4f6;
            border: 1px solid #d1d5db;
        }
        .comparison-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 15px;
        }
        .metric-row {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
        }
        .metric-title {
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="slide competition">
        <div class="header">
            <h1 class="slide-title">競合比較分析</h1>
            <div class="slide-number">5 / 8</div>
        </div>
        <div class="content">
            <div class="comparison-chart">
                <div class="comparison-item our-company">
                    <h3 class="comparison-title">当社サービス</h3>
                </div>
                <div class="comparison-item competitor">
                    <h3 class="comparison-title">競合A</h3>
                </div>
                <div class="comparison-item competitor">
                    <h3 class="comparison-title">競合B</h3>
                </div>
            </div>
            <div class="metric-row">
                <span class="metric-title">コスト効率</span>
            </div>
            <div class="metric-row">
                <span class="metric-title">導入期間</span>
            </div>
        </div>
    </div>
</body>
</html>`
  },
  {
    title: "ビジネスモデル",
    imagePath: "/cancerbridge/ビジネスモデル.png",
    slideNumber: "6 / 8",
    codeAnimation: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ビジネスモデル</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
        }
        .slide {
            width: 1280px;
            min-height: 720px;
            position: relative;
            background-color: white;
            overflow: hidden;
            box-sizing: border-box;
            padding: 40px 60px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .slide-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1e40af;
        }
        .slide-number {
            font-size: 1.2rem;
            color: #666;
            font-weight: 500;
        }
        .model-diagram {
            display: flex;
            flex-direction: column;
            gap: 30px;
            margin-top: 40px;
        }
        .model-row {
            display: flex;
            justify-content: space-between;
            gap: 20px;
        }
        .box {
            flex: 1;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            font-size: 1.2rem;
        }
        .customers {
            background-color: #dbeafe;
            border: 1px solid #93c5fd;
        }
        .value {
            background-color: #dcfce7;
            border: 1px solid #86efac;
        }
        .revenue {
            background-color: #fef3c7;
            border: 1px solid #fcd34d;
        }
        .partners {
            background-color: #f3e8ff;
            border: 1px solid #d8b4fe;
        }
        .arrow {
            display: flex;
            justify-content: center;
            font-size: 2rem;
            color: #9ca3af;
        }
    </style>
</head>
<body>
    <div class="slide business-model">
        <div class="header">
            <h1 class="slide-title">ビジネスモデル</h1>
            <div class="slide-number">6 / 8</div>
        </div>
        <div class="content">
            <div class="model-diagram">
                <div class="model-row">
                    <div class="box customers">顧客</div>
                    <div class="box value">価値提供</div>
                </div>
                <div class="arrow">
                    <i class="fas fa-arrow-down"></i>
                </div>
                <div class="model-row">
                    <div class="box revenue">収益構造</div>
                    <div class="box partners">パートナー</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
  },
  {
    title: "プロジェクト体制:リーダー",
    imagePath: "/cancerbridge/プロジェクト体制:リーダー.png",
    slideNumber: "7 / 8",
    codeAnimation: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>プロジェクト体制とリーダー</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
        }
        .slide {
            width: 1280px;
            min-height: 720px;
            position: relative;
            background-color: white;
            overflow: hidden;
            box-sizing: border-box;
            padding: 40px 60px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .slide-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1e40af;
        }
        .slide-number {
            font-size: 1.2rem;
            color: #666;
            font-weight: 500;
        }
        .leader-section {
            display: flex;
            gap: 40px;
            margin-top: 40px;
        }
        .leader-image {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            overflow: hidden;
            border: 3px solid #3b82f6;
        }
        .leader-info {
            flex: 1;
        }
        .leader-name {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 10px;
        }
        .leader-title {
            font-size: 1.2rem;
            color: #4b5563;
            margin-bottom: 20px;
        }
        .achievements {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 15px;
            border: 1px solid #e5e7eb;
        }
        .achievements-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: #1f2937;
        }
    </style>
</head>
<body>
    <div class="slide team-structure">
        <div class="header">
            <h1 class="slide-title">プロジェクト体制</h1>
            <div class="slide-number">7 / 8</div>
        </div>
        <div class="content">
            <div class="leader-section">
                <div class="leader-image">
                    <img src="leader.jpg" alt="リーダー写真" class="w-full h-full object-cover" />
                </div>
                <div class="leader-info">
                    <h2 class="leader-name">統括責任者</h2>
                    <p class="leader-title">プロジェクトリーダー</p>
                    <div class="achievements">
                        <h3 class="achievements-title">これまでの実績：</h3>
                        <p>〇〇〇</p>
                    </div>
                </div>
            </div>
            <div class="team-members"></div>
        </div>
    </div>
</body>
</html>`
  },
  {
    title: "まとめ",
    imagePath: "/cancerbridge/まとめ.png",
    slideNumber: "8 / 8",
    codeAnimation: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>まとめと次のステップ</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
        }
        .slide {
            width: 1280px;
            min-height: 720px;
            position: relative;
            background-color: white;
            overflow: hidden;
            box-sizing: border-box;
            padding: 40px 60px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .slide-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1e40af;
        }
        .slide-number {
            font-size: 1.2rem;
            color: #666;
            font-weight: 500;
        }
        .summary-points {
            margin-top: 30px;
            margin-bottom: 40px;
        }
        .summary-point {
            display: flex;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .point-icon {
            background-color: #dbeafe;
            color: #2563eb;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            flex-shrink: 0;
        }
        .point-text {
            font-size: 1.1rem;
            color: #1f2937;
        }
        .next-steps {
            background-color: #f0f9ff;
            border-radius: 8px;
            padding: 20px;
            border: 1px solid #bae6fd;
            margin-top: 30px;
        }
        .next-steps-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #0284c7;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="slide summary">
        <div class="header">
            <h1 class="slide-title">まとめ</h1>
            <div class="slide-number">8 / 8</div>
        </div>
        <div class="content">
            <div class="summary-points">
                <div class="summary-point">
                    <div class="point-icon"><i class="fas fa-check"></i></div>
                    <div class="point-text">社会課題解決への取り組み</div>
                </div>
                <div class="summary-point">
                    <div class="point-icon"><i class="fas fa-check"></i></div>
                    <div class="point-text">独自技術による差別化</div>
                </div>
                <div class="summary-point">
                    <div class="point-icon"><i class="fas fa-check"></i></div>
                    <div class="point-text">実現可能な市場戦略</div>
                </div>
                <div class="summary-point">
                    <div class="point-icon"><i class="fas fa-check"></i></div>
                    <div class="point-text">強力な実行体制</div>
                </div>
            </div>
            <div class="next-steps">
                <h3 class="next-steps-title">今後のスケジュール</h3>
            </div>
        </div>
    </div>
</body>
</html>`
  },
];

export default function PresentationGrid() {
  const [typedTexts, setTypedTexts] = useState<string[]>(Array(slides.length).fill(''));
  const [codeCompleted, setCodeCompleted] = useState<boolean[]>(Array(slides.length).fill(false));
  const timers = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // 全てのスライドで同時にタイピングアニメーションを開始
    slides.forEach((slide, index) => {
      startTypingAnimation(index);
    });

    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const startTypingAnimation = (slideIndex: number) => {
    const code = slides[slideIndex].codeAnimation;
    let currentText = '';
    let charIndex = 0;
    
    const typingTimer = setInterval(() => {
      if (charIndex < code.length) {
        currentText += code[charIndex];
        setTypedTexts(prev => {
          const newArray = [...prev];
          newArray[slideIndex] = currentText;
          return newArray;
        });
        charIndex++;
      } else {
        clearInterval(typingTimer);
        
        // タイピング完了したらすぐにスライドを表示するようフラグを設定
        setCodeCompleted(prev => {
          const newArray = [...prev];
          newArray[slideIndex] = true;
          return newArray;
        });
      }
    }, 20); // タイピング速度
    
    timers.current.push(typingTimer as unknown as NodeJS.Timeout);
  };

  return (
    <div className="w-full h-full bg-gray-100 text-black overflow-auto p-0">
      <div className="grid grid-cols-2 gap-4 p-4">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className="relative w-full mb-4 overflow-hidden rounded-lg shadow-lg bg-white"
            style={{ aspectRatio: '16/9' }}
          >
            {/* コード表示エリア - コード完了後に非表示 */}
            <div 
              className={`absolute top-0 left-0 w-full z-10 bg-gray-900 overflow-hidden transition-all duration-300 ${
                codeCompleted[index] ? 'h-0 opacity-0' : 'h-full opacity-100'
              }`}
            >
              <pre className="text-xs text-green-400 font-mono p-2 overflow-auto h-full">
                {typedTexts[index]}
              </pre>
            </div>
            
            {/* スライド画像 - コード完了後に全画面表示 */}
            <div 
              className={`absolute inset-0 transition-all duration-300 ${
                codeCompleted[index] ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={slide.imagePath}
                  alt={slide.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 