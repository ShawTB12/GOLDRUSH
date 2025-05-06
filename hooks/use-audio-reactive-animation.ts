import { useState, useEffect, useRef } from 'react';
import { useAudioAnalyzer } from './use-audio-analyzer';

interface AudioReactiveAnimationState {
  isPlaying: boolean;
  audioLevel: number;
  startAnimation: () => Promise<void>;
  stopAnimation: () => void;
}

export function useAudioReactiveAnimation(audioPath: string = '/sounds/goldrush-startup-backup.mp3', duration: number = 8000): AudioReactiveAnimationState {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserInteraction, setHasUserInteraction] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  
  // オーディオアナライザーフックを使用
  const { 
    isAnalyzing, 
    audioLevel, 
    startAnalyzing, 
    stopAnalyzing 
  } = useAudioAnalyzer();
  
  // ブラウザの自動再生ポリシー対応のためのイベントリスナー
  useEffect(() => {
    console.log('🎵 AudioReactive: 初期化');
    
    // ユーザーインタラクションを既に検出済みとしてマーク
    setHasUserInteraction(true);
    
    const handleUserInteraction = () => {
      console.log('🎵 ユーザーインタラクション検出');
      setHasUserInteraction(true);
      
      // オーディオコンテキストの再開（必要であれば）
      if (typeof window !== 'undefined') {
        try {
          // 無音を再生して、オーディオコンテキストを確実に起動
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const tempContext = new AudioContext();
            tempContext.resume().then(() => {
              console.log('🎵 AudioContext再開成功');
              
              // 無音の音声を生成して再生（短時間だけ）
              const oscillator = tempContext.createOscillator();
              const gainNode = tempContext.createGain();
              
              // 音量を0に設定（無音）
              gainNode.gain.value = 0;
              
              oscillator.connect(gainNode);
              gainNode.connect(tempContext.destination);
              
              // 0.1秒だけ再生
              oscillator.start(tempContext.currentTime);
              oscillator.stop(tempContext.currentTime + 0.1);
              
              // 少し経ったらコンテキストを閉じる
              setTimeout(() => {
                tempContext.close().catch(err => {
                  console.error('🎵 AudioContext閉じる失敗:', err);
                });
              }, 200);
            }).catch(err => {
              console.error('🎵 AudioContext再開失敗:', err);
            });
          }
        } catch (e) {
          console.error('🎵 オーディオ初期化エラー:', e);
        }
      }
    };
    
    // ユーザーインタラクションイベントを追加
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    
    // 初期化時に一度実行
    handleUserInteraction();
    
    return () => {
      // イベントリスナーを削除
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      console.log('🎵 AudioReactive: クリーンアップ');
    };
  }, []);
  
  // コンポーネントがマウントされたときにオーディオを初期化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 初期化時に一度だけオーディオ要素を作成
      console.log('🎵 オーディオ要素作成:', audioPath);
      audioRef.current = new Audio(audioPath);
      // 音声を事前にロード
      audioRef.current.load();
      
      // 音量を最大に設定
      if (audioRef.current) {
        audioRef.current.volume = 1.0;
      }
      
      // 音声再生終了時のイベントリスナー
      const handleEnded = () => {
        console.log('🎵 再生終了');
        stopAnimation();
      };
      
      // エラー発生時のイベントリスナー
      const handleError = (error: Event) => {
        console.error('🎵 音声再生エラー:', error);
        stopAnimation();
      };
      
      // イベントリスナーを設定
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);
      
      // クリーンアップ関数
      return () => {
        if (audioRef.current) {
          console.log('🎵 オーディオクリーンアップ');
          audioRef.current.removeEventListener('ended', handleEnded);
          audioRef.current.removeEventListener('error', handleError);
          
          // 再生中なら停止
          if (playPromiseRef.current) {
            playPromiseRef.current.then(() => {
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              }
            }).catch(err => {
              console.error('🎵 再生停止時のエラー:', err);
            });
          } else if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          
          audioRef.current = null;
        }
        
        // タイムアウトをクリア
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // 分析を停止
        stopAnalyzing();
      };
    }
  }, [audioPath, stopAnalyzing]);
  
  // アニメーション開始関数
  const startAnimation = async (): Promise<void> => {
    console.log('🎵 アニメーション開始リクエスト');
    
    // すでに再生中なら何もしない
    if (isPlaying) {
      console.log('🎵 すでに再生中');
      return;
    }
    
    // 以前のタイムアウトがあればクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // オーディオが初期化されていることを確認
    if (!audioRef.current) {
      console.log('🎵 オーディオ要素を再作成');
      audioRef.current = new Audio(audioPath);
      audioRef.current.load();
      audioRef.current.volume = 1.0; // 音量を最大に設定
    }
    
    try {
      // 念のため進行中のプレイプロミスをクリーンアップ
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch (e) {
          console.log('🎵 前回のプレイプロミスをキャンセル:', e);
        }
        playPromiseRef.current = null;
      }
      
      // 再生位置をリセット
      audioRef.current.currentTime = 0;
      
      // ミュート状態をリセット
      audioRef.current.muted = false;
      audioRef.current.volume = 1.0; // 音量を最大に設定
      
      // 音声分析を開始
      startAnalyzing(audioRef.current);
      
      // 再生ボタンがクリックされたことを明示的に示すためにsetPlayingを先に設定
      setIsPlaying(true);
      
      console.log('🎵 音声再生開始');
      
      // 直接音声再生
      try {
        playPromiseRef.current = audioRef.current.play();
        await playPromiseRef.current;
        console.log('🎵 音声再生成功');
        
        // タイマーを設定
        console.log('🎵 タイマー設定:', duration, 'ms');
        timeoutRef.current = setTimeout(() => {
          console.log('🎵 タイマー終了');
          stopAnimation();
        }, duration);
      } catch (playError) {
        console.error('🎵 音声再生エラー:', playError);
        
        // フォールバック：自動再生制限があるかもしれないので、ユーザーインタラクションをシミュレート
        document.body.click(); // ユーザーインタラクションをシミュレート
        
        try {
          // 再度再生を試みる
          playPromiseRef.current = audioRef.current.play();
          await playPromiseRef.current;
          console.log('🎵 再試行で音声再生成功');
          
          // タイマーを設定
          timeoutRef.current = setTimeout(() => {
            console.log('🎵 タイマー終了');
            stopAnimation();
          }, duration);
        } catch (secondError) {
          console.error('🎵 2回目の再生試行も失敗:', secondError);
          
          // 最終フォールバック：音声なしで視覚効果のみ提供
          timeoutRef.current = setTimeout(() => {
            console.log('🎵 視覚効果のみのタイマー終了');
            stopAnimation();
          }, duration);
        }
      }
      
    } catch (error) {
      console.error('🎵 音声再生エラー:', error);
      stopAnalyzing();
      setIsPlaying(false);
      playPromiseRef.current = null;
      throw error;
    }
  };
  
  // アニメーション停止関数
  const stopAnimation = () => {
    // 再生中でなければ何もしない
    if (!isPlaying) {
      console.log('🎵 停止: 再生中ではありません');
      return;
    }
    
    console.log('🎵 アニメーション停止');
    
    // タイムアウトをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // 音声を停止
    if (audioRef.current) {
      // 進行中のplayPromiseがあれば、それが解決してから停止
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => {
            if (audioRef.current) {
              console.log('🎵 音声停止 (プロミス解決後)');
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
              audioRef.current.muted = false; // ミュート状態をリセット
            }
            playPromiseRef.current = null;
          })
          .catch(() => {
            if (audioRef.current) {
              console.log('🎵 音声停止 (プロミス失敗後)');
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
              audioRef.current.muted = false; // ミュート状態をリセット
            }
            playPromiseRef.current = null;
          });
      } else {
        console.log('🎵 音声停止 (直接)');
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false; // ミュート状態をリセット
      }
    }
    
    // 音声分析を停止
    stopAnalyzing();
    
    // 再生状態を更新
    setIsPlaying(false);
  };
  
  return {
    isPlaying,
    audioLevel,
    startAnimation,
    stopAnimation
  };
} 