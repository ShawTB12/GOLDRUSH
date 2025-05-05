'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface StartupAnimationProps {
  onAnimationComplete: () => void;
}

interface IdeaItem {
  text: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  startTime: number;
  color: string;
  glowIntensity: number;
  width?: number; // テキスト幅（重なり検出用）
}

export function StartupAnimation({ onAnimationComplete }: StartupAnimationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCosmicAnimation, setShowCosmicAnimation] = useState(false);
  
  // アイデア表示用
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const ideasRef = useRef<IdeaItem[]>([]);
  
  // コズミックマップアニメーション用のキャンバス参照
  const cosmicCanvasRef = useRef<HTMLCanvasElement>(null);
  const cosmicAnimationFrameRef = useRef<number>(0);
  
  // ロゴのセーフエリア用の参照を追加
  const logoSafeAreaRef = useRef<{x: number, y: number, width: number, height: number} | null>(null);

  // 新規事業アイデアのリスト (英語)
  const businessIdeas = [
    "AI-Powered Medical Diagnostics",
    "Blockchain Identity Verification",
    "VR Real Estate Tours",
    "Crowdsourced Financial Platform",
    "Sustainable Supply Chain Analytics",
    "Digital Twin Manufacturing",
    "Autonomous Transportation Network",
    "AR Navigation Systems",
    "Smart City Infrastructure",
    "IoT Agricultural Ecosystem",
    "Quantum Computing Services",
    "Voice AI Assistant Integration",
    "Contactless Payment Solutions",
    "Clean Energy Trading Platform",
    "Biotech Drug Discovery",
    "Cybersecurity Insurance",
    "Remote Healthcare Monitoring",
    "Drone Delivery Network",
    "Food-Tech Alternative Proteins",
    "Space Tourism Platform",
    "NFT Marketplace Solutions",
    "Metaverse Real Estate",
    "Digital Twin Urban Planning",
    "Robotic Customer Service",
    "Sustainable Fashion Ecosystem",
    "AI Creative Tools Suite",
    "Biometric Authentication",
    "Micro-Mobility Services",
    "Sharing Economy Platform",
    "Remote Work Optimization",
    "Digital Transformation Consulting",
    "Neural Interface Technology",
    "Smart Contract Legal Framework",
    "Personalized Education Platform",
    "Carbon Offset Marketplace",
    "Ocean Resource Conservation Tech",
    "Renewable Energy Storage",
    "Circular Economy Solutions",
    "Digital Health Management",
    "Predictive Maintenance Systems",
    "3D-Printed Architecture",
    "Micro-Insurance Platform",
    "Alternative Data Analytics",
    "Edge Computing Network",
    "Personal Data Sovereignty",
    "Self-Sovereign Identity",
    "Autonomous Drone Surveying",
    "Virtual Influencer Agency",
    "Sustainable Investment Platform",
    "AI Matching Algorithms",
    "Space-Based Solar Power",
    "Quantum Cryptography",
    "Neurotech Cognitive Enhancement",
    "Human Augmentation Solutions",
    "Asteroid Mining Ventures",
    "Longevity Biotech Research",
    "Vertical Farming Systems",
    "Lab-Grown Meat Production",
    "Brain-Computer Interface",
    "Autonomous Underwater Vehicles",
  ];

  // アイデア表示アニメーション
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスサイズをウィンドウサイズに合わせる
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // ロゴのセーフエリアを設定
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const safeWidth = Math.max(300, canvas.width * 0.25); // ロゴとテキストのセーフエリア幅
      const safeHeight = Math.max(300, canvas.height * 0.3); // ロゴとテキストのセーフエリア高さ
      
      logoSafeAreaRef.current = {
        x: centerX - safeWidth / 2,
        y: centerY - safeHeight / 2,
        width: safeWidth,
        height: safeHeight
      };
    };

    // 初期化時とリサイズ時にキャンバスサイズを設定
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 新しい位置がロゴのセーフエリア内にあるかチェック
    const isInSafeArea = (x: number, y: number): boolean => {
      const safeArea = logoSafeAreaRef.current;
      if (!safeArea) return false;
      
      return (
        x >= safeArea.x && 
        x <= safeArea.x + safeArea.width && 
        y >= safeArea.y && 
        y <= safeArea.y + safeArea.height
      );
    };

    // 文字列同士の重なりをチェックする関数
    const isOverlappingWithOtherIdeas = (x: number, y: number, width: number, height: number): boolean => {
      // 最小距離（文字列間のスペース）
      const minDistance = 40;
      
      // 既存のアイデア全てをチェック
      return ideasRef.current.some(idea => {
        // 既存テキストの概算の幅と高さ
        const ideaWidth = idea.width || 150; // 幅が設定されていない場合のデフォルト値
        const ideaHeight = idea.size * 1.5; // テキストの高さは大体フォントサイズの1.5倍とする
        
        // 中心点間の距離を計算
        const distanceX = Math.abs(x - idea.x);
        const distanceY = Math.abs(y - idea.y);
        
        // 2つのテキストの中心間距離が、両方のテキスト幅/2 + 最小距離より小さい場合は重なっていると判断
        return (
          distanceX < (width / 2 + ideaWidth / 2 + minDistance) &&
          distanceY < (height / 2 + ideaHeight / 2 + minDistance)
        );
      });
    };

    // テキストの幅を測定する関数
    const measureTextWidth = (text: string, fontSize: number): number => {
      ctx.font = `${fontSize}px 'Montserrat', 'Roboto', 'Helvetica Neue', sans-serif`;
      return ctx.measureText(text).width;
    };

    // 新しいアイデアをランダムに生成（ロゴエリアとテキスト重なりを避ける）
    const createRandomIdea = (): IdeaItem => {
      const text = businessIdeas[Math.floor(Math.random() * businessIdeas.length)];
      let x, y;
      let size = 14 + Math.random() * 16; // 14〜30px
      
      // テキストの幅を測定
      const textWidth = measureTextWidth(text, size);
      const textHeight = size * 1.5;
      
      // ロゴのセーフエリアと既存テキストを避ける位置を生成（最大100回試行）
      let attempts = 0;
      const maxAttempts = 100;
      
      do {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
        attempts++;
        
        // 最大試行回数を超えた場合はサイズを小さくして再試行（空きスペースを見つけやすくする）
        if (attempts > maxAttempts / 2 && size > 16) {
          size = 14 + Math.random() * 6; // サイズを小さくする
        }
        
        // それでも見つからない場合は諦めて返す
        if (attempts >= maxAttempts) {
          break;
        }
      } while (
        isInSafeArea(x, y) || 
        isOverlappingWithOtherIdeas(x, y, textWidth, textHeight) ||
        // 画面外に出ないようにする
        x - textWidth / 2 < 10 ||
        x + textWidth / 2 > canvas.width - 10 ||
        y - textHeight / 2 < 10 ||
        y + textHeight / 2 > canvas.height - 10
      );
      
      // ゴールドベースの色に微妙な変化をつける
      const hue = 45 + Math.random() * 10; // 黄金色付近の色相
      const saturation = 80 + Math.random() * 20; // 高い彩度
      const lightness = 50 + Math.random() * 30; // 中〜高の明度
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      
      // グロー効果の強さ（0〜10px）
      const glowIntensity = Math.random() * 10;
      
      return {
        text,
        x,
        y,
        size,
        opacity: 0,
        duration: 2500 + Math.random() * 4500, // 出現・消失速度をさらに高速化 (3200〜9600ms→2500〜7000ms)
        startTime: Date.now(),
        color,
        glowIntensity,
        width: textWidth
      };
    };

    // 定期的に新しいアイデアを追加
    const addIdeaInterval = setInterval(() => {
      // アクティブなアイデアが多すぎる場合は追加しない（パフォーマンス考慮）
      if (ideasRef.current.length < 20) {
        ideasRef.current.push(createRandomIdea());
      }
    }, 320); // 追加間隔をさらに短く (480ms→320ms)

    // 描画関数
    const draw = () => {
      // キャンバスをクリア（完全に透明にせず、微かな残像効果を保持）
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const currentTime = Date.now();
      const updatedIdeas: IdeaItem[] = [];
      
      // 各アイデアを描画
      ideasRef.current.forEach(idea => {
        const elapsed = currentTime - idea.startTime;
        const progress = Math.min(elapsed / idea.duration, 1);
        
        // フェードイン・フェードアウト効果
        let opacity = 0;
        if (progress < 0.2) {
          // 最初の20%でフェードイン
          opacity = progress / 0.2;
        } else if (progress > 0.8) {
          // 最後の20%でフェードアウト
          opacity = (1 - progress) / 0.2;
        } else {
          // 中間60%は完全表示
          opacity = 1;
        }
        
        // アイデアが表示期間内なら描画して更新リストに追加
        if (progress < 1) {
          // テキストの設定
          ctx.save(); // 現在の描画状態を保存
          
          // テキストを回転させない - 単に位置に移動するだけ
          ctx.translate(idea.x, idea.y);
          
          // フォントスタイル（近未来的なサンスセリフフォント）
          ctx.font = `${idea.size}px 'Montserrat', 'Roboto', 'Helvetica Neue', sans-serif`;
          ctx.textAlign = 'center';
          
          // テキストグロー効果
          if (idea.glowIntensity > 0) {
            ctx.shadowColor = idea.color;
            ctx.shadowBlur = idea.glowIntensity;
          }
          
          // テキスト描画
          ctx.globalAlpha = opacity;
          ctx.fillStyle = idea.color;
          ctx.fillText(idea.text, 0, 0);
          
          // 3D効果（薄いテキストの重ね描き）
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillText(idea.text, 1, 1);
          
          ctx.restore(); // 描画状態を元に戻す
          
          updatedIdeas.push({
            ...idea,
            opacity
          });
        }
      });
      
      // 有効期限内のアイデアだけを保持
      ideasRef.current = updatedIdeas;
      
      // 繰り返し
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    // アニメーション開始
    animationFrameRef.current = requestAnimationFrame(draw);

    // 初期アイデアをいくつか追加
    for (let i = 0; i < 10; i++) {
      ideasRef.current.push(createRandomIdea());
    }

    // クリーンアップ関数
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      clearInterval(addIdeaInterval);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  // コズミックトレジャーマップアニメーション
  useEffect(() => {
    if (!showCosmicAnimation) return;
    
    const canvas = cosmicCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // キャンバスサイズをウィンドウサイズに合わせる
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // アニメーションパラメータ
    const animationDuration = 5000; // 5秒間
    const startTime = Date.now();
    
    // 星の配列
    const stars: {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
    }[] = [];
    
    // 星座の配列
    const constellations: {
      points: {x: number, y: number}[];
      name: string;
      centerX: number;
      centerY: number;
      radius: number;
      drawProgress: number;
      color: string;
    }[] = [];
    
    // ビジネスアイデアノード
    const businessNodes: {
      x: number;
      y: number;
      size: number;
      idea: string;
      opacity: number;
      connectsTo: number[];
    }[] = [];
    
    // 星を生成（背景の小さな星）
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 3 + 0.1,
        size: Math.random() * 2 + 0.5,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`
      });
    }
    
    // 星座を生成
    const createConstellation = (
      centerX: number, 
      centerY: number, 
      radius: number, 
      pointCount: number,
      name: string
    ) => {
      const points: {x: number, y: number}[] = [];
      
      // ランダムな星座パターンを生成
      for (let i = 0; i < pointCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius * 0.8 + radius * 0.2;
        points.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance
        });
      }
      
      // 星座の色（金色系）
      const hue = 40 + Math.random() * 20; // 黄金色の範囲
      const saturation = 80 + Math.random() * 20;
      const lightness = 50 + Math.random() * 20;
      const color = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
      
      constellations.push({
        points,
        name,
        centerX,
        centerY,
        radius,
        drawProgress: 0,
        color
      });
    };
    
    // 複数の星座を生成
    createConstellation(canvas.width * 0.3, canvas.height * 0.3, 100, 6, "AIクラスター");
    createConstellation(canvas.width * 0.7, canvas.height * 0.3, 120, 7, "宇宙開発領域");
    createConstellation(canvas.width * 0.5, canvas.height * 0.7, 110, 5, "バイオテック");
    createConstellation(canvas.width * 0.2, canvas.height * 0.6, 90, 6, "フィンテック");
    createConstellation(canvas.width * 0.8, canvas.height * 0.6, 100, 8, "持続可能エネルギー");
    
    // ビジネスアイデアノード生成
    const createBusinessNode = (x: number, y: number, idea: string, connectsTo: number[]) => {
      businessNodes.push({
        x,
        y,
        size: 6 + Math.random() * 4,
        idea,
        opacity: 0,
        connectsTo
      });
    };
    
    // 重要な交差点に配置するビジネスアイデア
    createBusinessNode(canvas.width * 0.4, canvas.height * 0.3, "AI医療診断", [0, 2]);
    createBusinessNode(canvas.width * 0.6, canvas.height * 0.4, "宇宙観光プラットフォーム", [1, 4]);
    createBusinessNode(canvas.width * 0.3, canvas.height * 0.5, "合成生物学", [2, 3]);
    createBusinessNode(canvas.width * 0.5, canvas.height * 0.6, "カーボンオフセット取引", [3, 4]);
    createBusinessNode(canvas.width * 0.7, canvas.height * 0.5, "量子コンピューティング", [0, 1]);
    
    // 主要なカメラパラメータ
    let cameraZ = 0;
    let cameraZoomFactor = 1;
    
    // 描画関数
    const draw = () => {
      // 経過時間とアニメーション進行度の計算
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // 背景をクリア（宇宙空間のように暗く）
      ctx.fillStyle = 'rgba(10, 5, 20, 0.3)'; // 暗い青紫の背景（残像エフェクト用に半透明）
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // カメラの動きパラメータ更新
      cameraZ = progress * 500;
      
      // フェーズに応じたカメラのズーム
      if (progress < 0.7) {
        // 最初の70%はズームイン
        cameraZoomFactor = 1 + progress * 0.5;
      } else {
        // 残りの30%はズームアウト
        cameraZoomFactor = 1.35 - (progress - 0.7) * 1.2;
      }
      
      // 背景の星を描画
      stars.forEach(star => {
        // 視点の移動を計算
        const perspective = 1 + (star.z * progress * 2);
        const x = star.x + (star.x - canvas.width/2) * progress * 0.1 * star.z;
        const y = star.y + (star.y - canvas.height/2) * progress * 0.1 * star.z;
        
        // 星のサイズと不透明度の計算
        const starProgress = Math.min(progress * 2, 1);
        const size = star.size * perspective * starProgress;
        const opacity = parseFloat(star.color.match(/[\d.]+(?=\)$)/)?.[0] || "0.5") * starProgress;
        
        // 星を描画
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 大きな星には光芒を追加
        if (size > 1.5 && progress > 0.2) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
          ctx.lineWidth = 0.5;
          
          // 十字の光芒
          ctx.beginPath();
          ctx.moveTo(x - size * 2, y);
          ctx.lineTo(x + size * 2, y);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(x, y - size * 2);
          ctx.lineTo(x, y + size * 2);
          ctx.stroke();
        }
      });
      
      // 星座の描画
      constellations.forEach((constellation, index) => {
        // 星座の出現タイミングを段階的に（0.1秒ずつ遅らせる）
        const constellationDelay = index * 0.1;
        const constellationProgress = Math.max(0, Math.min(1, (progress - constellationDelay) * 3));
        
        if (constellationProgress <= 0) return;
        
        constellation.drawProgress = constellationProgress;
        
        // 星座の各点を描画
        constellation.points.forEach((point, i) => {
          const pointProgress = Math.min(constellationProgress * 2, 1);
          const size = 2 + pointProgress * 3;
          
          // 黄金色で星を描画
          ctx.fillStyle = constellation.color.replace('0.6', `${pointProgress * 0.8}`);
          ctx.shadowColor = constellation.color;
          ctx.shadowBlur = 5 * pointProgress;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.shadowBlur = 0;
          
          // 次の点との接続線を描画
          if (i < constellation.points.length - 1 && constellationProgress > 0.3) {
            const nextPoint = constellation.points[i + 1];
            const lineProgress = Math.min((constellationProgress - 0.3) * 2, 1);
            
            // 線のグラデーションを作成
            const gradient = ctx.createLinearGradient(point.x, point.y, nextPoint.x, nextPoint.y);
            gradient.addColorStop(0, constellation.color.replace('0.6', `${lineProgress * 0.6}`));
            gradient.addColorStop(1, constellation.color.replace('0.6', `${lineProgress * 0.3}`));
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1 * lineProgress;
            
            // 線を描画する長さを進行度に応じて調整
            const dx = nextPoint.x - point.x;
            const dy = nextPoint.y - point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(
              point.x + dx * lineProgress,
              point.y + dy * lineProgress
            );
            ctx.stroke();
          }
        });
        
        // 星座名を表示（70%以降）
        if (progress > 0.5) {
          const nameOpacity = Math.min((progress - 0.5) * 4, 1);
          ctx.font = '14px "Montserrat", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = `rgba(255, 215, 0, ${nameOpacity * 0.8})`;
          ctx.fillText(constellation.name, constellation.centerX, constellation.centerY);
        }
      });
      
      // ビジネスアイデアノードの描画（50%以降）
      if (progress > 0.4) {
        businessNodes.forEach((node, index) => {
          // ノードの出現を段階的に
          const nodeDelay = 0.4 + index * 0.05;
          const nodeProgress = Math.max(0, Math.min(1, (progress - nodeDelay) * 3));
          
          if (nodeProgress <= 0) return;
          
          node.opacity = nodeProgress;
          
          // ノードを描画
          const gradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, node.size * 2
          );
          gradient.addColorStop(0, `rgba(255, 215, 0, ${nodeProgress * 0.9})`);
          gradient.addColorStop(0.6, `rgba(255, 215, 0, ${nodeProgress * 0.4})`);
          gradient.addColorStop(1, `rgba(255, 215, 0, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size * 2, 0, Math.PI * 2);
          ctx.fill();
          
          // 中心の明るい部分
          ctx.fillStyle = `rgba(255, 255, 255, ${nodeProgress * 0.9})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
          
          // ビジネスアイデアのテキスト（60%以降）
          if (progress > 0.6) {
            const textOpacity = Math.min((progress - 0.6) * 5, 1);
            ctx.font = 'bold 12px "Montserrat", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `rgba(255, 255, 255, ${textOpacity * 0.9})`;
            
            // テキストに光彩効果
            ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
            ctx.shadowBlur = 4;
            ctx.fillText(node.idea, node.x, node.y - node.size * 2 - 8);
            ctx.shadowBlur = 0;
          }
          
          // ノード間の接続線（65%以降）
          if (progress > 0.65) {
            const lineOpacity = Math.min((progress - 0.65) * 4, 1);
            
            node.connectsTo.forEach(targetIndex => {
              if (targetIndex >= 0 && targetIndex < businessNodes.length) {
                const target = businessNodes[targetIndex];
                
                // 接続線のグラデーション
                const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
                gradient.addColorStop(0, `rgba(255, 215, 0, ${lineOpacity * 0.7})`);
                gradient.addColorStop(0.5, `rgba(255, 215, 0, ${lineOpacity * 0.3})`);
                gradient.addColorStop(1, `rgba(255, 215, 0, ${lineOpacity * 0.7})`);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.5 * lineOpacity;
                
                // 線を描画
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(target.x, target.y);
                ctx.stroke();
                
                // 流れるエフェクト
                const pulsePosition = (elapsed % 2000) / 2000;
                const pulseX = node.x + (target.x - node.x) * pulsePosition;
                const pulseY = node.y + (target.y - node.y) * pulsePosition;
                
                ctx.fillStyle = `rgba(255, 255, 255, ${lineOpacity * 0.8})`;
                ctx.beginPath();
                ctx.arc(pulseX, pulseY, 2 * lineOpacity, 0, Math.PI * 2);
                ctx.fill();
              }
            });
          }
        });
      }
      
      // GOLD RUSHロゴの表示（85%以降）
      if (progress > 0.85) {
        const logoOpacity = Math.min((progress - 0.85) * 6, 1);
        
        // ロゴの背景グロー
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const logoSize = 80;
        
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, logoSize * 2
        );
        gradient.addColorStop(0, `rgba(255, 215, 0, ${logoOpacity * 0.4})`);
        gradient.addColorStop(0.7, `rgba(255, 215, 0, ${logoOpacity * 0.1})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, logoSize * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // ロゴテキスト
        ctx.font = `bold ${logoSize}px "Montserrat", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(255, 215, 0, ${logoOpacity})`;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fillText("GOLD RUSH", centerX, centerY);
        ctx.shadowBlur = 0;
        
        // サブテキスト
        ctx.font = `${logoSize/4}px "Montserrat", sans-serif`;
        ctx.fillStyle = `rgba(255, 255, 255, ${logoOpacity * 0.9})`;
        ctx.fillText("FUTURE VENTURES", centerX, centerY + logoSize/2 + 10);
      }
      
      // アニメーションの継続または終了
      if (progress < 1) {
        cosmicAnimationFrameRef.current = requestAnimationFrame(draw);
      } else {
        // 完了したらメインUIへ
        setTimeout(() => {
          onAnimationComplete();
        }, 200);
      }
    };
    
    // アニメーション開始
    cosmicAnimationFrameRef.current = requestAnimationFrame(draw);
    
    // クリーンアップ
    return () => {
      cancelAnimationFrame(cosmicAnimationFrameRef.current);
    };
  }, [showCosmicAnimation, onAnimationComplete]);

  // ロゴクリック時のログイン処理
  const handleLogin = () => {
    // コズミックマップアニメーションを開始
    setShowCosmicAnimation(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      {/* アイデア表示アニメーション */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${showCosmicAnimation ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        style={{ zIndex: 0 }}
      />
      
      {/* コズミックマップアニメーション用キャンバス */}
      {showCosmicAnimation && (
        <canvas
          ref={cosmicCanvasRef}
          className="absolute inset-0 w-full h-full z-10 animate-fade-in"
        />
      )}
      
      {/* メイン画面（クリックでログイン可能なロゴを表示） */}
      <div className={`flex flex-col items-center justify-center z-20 ${showCosmicAnimation ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
        <div className="mb-6">
          <Image
            src="/GOLDRUSH_icon.jpg"
            alt="GOLDRUSH Logo"
            width={180}
            height={180}
            className="rounded-xl cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#FFD700]/30"
            onClick={handleLogin}
          />
        </div>
        <h1 className="text-[#FFD700] text-5xl font-bold tracking-wider flex flex-col items-center">
          <span>GOLD RUSH</span>
          <span className="text-sm mt-2 opacity-80 tracking-widest">FUTURE VENTURES</span>
        </h1>
        <div className="mt-4 text-white/60 text-sm">
          <span className="animate-pulse">ロゴをクリックして始める</span>
        </div>
      </div>
      
      {/* フッター */}
      <div className={`absolute bottom-4 text-[#FFD700] text-xs opacity-70 z-20 ${showCosmicAnimation ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        <p>© 2023 GOLD RUSH - AI-Powered Business Discovery</p>
      </div>
      
      {/* アニメーション用スタイル */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}