'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import TestMarketingGrid from './test-marketing-grid';

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
  const [expandedSlideIndex, setExpandedSlideIndex] = useState<number | null>(null);
  const [showTestMarketing, setShowTestMarketing] = useState<boolean>(false);
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
    
    // 3文字ずつ追加することで3倍速に
    const typingTimer = setInterval(() => {
      if (charIndex < code.length) {
        // 3文字ずつ追加（ただし残りが3文字未満の場合は残りを全て追加）
        const charsToAdd = Math.min(3, code.length - charIndex);
        currentText += code.substring(charIndex, charIndex + charsToAdd);
        setTypedTexts(prev => {
          const newArray = [...prev];
          newArray[slideIndex] = currentText;
          return newArray;
        });
        charIndex += charsToAdd;
      } else {
        clearInterval(typingTimer);
        
        // タイピング完了したらすぐにスライドを表示するようフラグを設定
        setCodeCompleted(prev => {
          const newArray = [...prev];
          newArray[slideIndex] = true;
          return newArray;
        });
      }
    }, 7); // タイピング速度を3倍に (20ms→7ms)
    
    timers.current.push(typingTimer as unknown as NodeJS.Timeout);
  };

  const handleSlideClick = (index: number) => {
    if (expandedSlideIndex === index) {
      // 同じスライドをクリックした場合は縮小
      setExpandedSlideIndex(null);
    } else {
      // 別のスライドをクリックした場合は拡大
      setExpandedSlideIndex(index);
    }
  };

  const handleSurveyClick = () => {
    // 直接テストマーケティンググリッドを表示
    setShowTestMarketing(true);
  };



  // テストマーケティング画面を表示する場合
  if (showTestMarketing) {
    return <TestMarketingGrid onBackToSlides={() => setShowTestMarketing(false)} />;
  }

  return (
    <div className="w-full min-h-full bg-white text-black overflow-auto" style={{ backgroundColor: 'white' }}>
      {/* 拡大表示されたスライド */}
      {expandedSlideIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80"
          onClick={() => setExpandedSlideIndex(null)}
        >
          <div 
            className="relative w-5/6 h-5/6 max-w-6xl rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={slides[expandedSlideIndex].imagePath}
                alt={slides[expandedSlideIndex].title}
                fill
                className="object-contain"
                priority
              />
              <div className="absolute top-2 right-2 bg-white bg-opacity-70 px-2 py-1 rounded text-sm">
                {slides[expandedSlideIndex].slideNumber}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メインコンテナ */}
      <div className="bg-white p-4" style={{ backgroundColor: 'white' }}>
      {/* グリッド表示 */}
        <div className={`grid grid-cols-2 gap-4 ${expandedSlideIndex !== null ? 'pointer-events-none opacity-50' : ''}`}>
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`relative w-full mb-4 overflow-hidden rounded-lg shadow-lg bg-white cursor-pointer transform transition-transform duration-200 ${
              expandedSlideIndex === null && codeCompleted[index] ? 'hover:scale-105' : ''
            }`}
            style={{ aspectRatio: '16/9' }}
            onClick={() => codeCompleted[index] && handleSlideClick(index)}
          >
            {/* コード表示エリア - コード完了後に非表示 */}
            <div 
              className={`absolute top-0 left-0 w-full z-10 bg-gray-900 overflow-hidden transition-all duration-100 ${
                codeCompleted[index] ? 'h-0 opacity-0' : 'h-full opacity-100'
              }`}
            >
              <pre className="text-xs text-green-400 font-mono p-2 overflow-auto h-full">
                {typedTexts[index]}
              </pre>
            </div>
            
            {/* スライド画像 - コード完了後に全画面表示 */}
            <div 
              className={`absolute inset-0 transition-all duration-100 ${
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
                {codeCompleted[index] && (
                  <div className="absolute top-2 right-2 bg-white bg-opacity-70 px-2 py-1 rounded text-sm">
                    {slide.slideNumber}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* アンケート調査ボタンエリア - 白い背景で下方に拡張 */}
      <div className="bg-white px-4 py-8 border-t border-gray-200">
        <div className="flex justify-center">
          <button
            onClick={handleSurveyClick}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xl font-bold shadow-xl border-2 border-blue-300 hover:scale-105 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
              />
            </svg>
            新規事業 1万本ノック
          </button>
        </div>

      </div>
    </div>
  );
} 