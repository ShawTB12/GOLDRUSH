import { useState, useEffect, useRef } from 'react';

interface AudioAnalyzerState {
  isAnalyzing: boolean;
  audioLevel: number;  // 0-1の範囲の音量レベル
  frequencyData: Uint8Array | null;
  startAnalyzing: (audioElem: HTMLAudioElement) => void;
  stopAnalyzing: () => void;
}

export function useAudioAnalyzer(): AudioAnalyzerState {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  
  // Web Audio API関連のリファレンス
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  
  // クリーンアップ関数
  const cleanup = () => {
    console.log('🔊 Audio Analyzer: クリーンアップ実行');
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsAnalyzing(false);
    setAudioLevel(0);
    setFrequencyData(null);
  };
  
  // アンマウント時のクリーンアップ
  useEffect(() => {
    console.log('🔊 Audio Analyzer: 初期化');
    return () => {
      console.log('🔊 Audio Analyzer: アンマウント');
      cleanup();
    };
  }, []);
  
  // 分析開始関数
  const startAnalyzing = (audioElem: HTMLAudioElement) => {
    console.log('🔊 Audio Analyzer: 分析開始', audioElem);
    // 既存の分析があれば停止
    cleanup();
    
    try {
      // AudioContextの作成
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.error('Web Audio APIはこのブラウザでサポートされていません');
        return;
      }
      
      // AudioContextの作成
      audioContextRef.current = new AudioContext();
      console.log('🔊 AudioContext 状態:', audioContextRef.current.state);
      
      // ブラウザによっては一時停止状態で作成されることがある
      if (audioContextRef.current.state === 'suspended') {
        console.log('🔊 AudioContext 停止状態。再開します...');
        audioContextRef.current.resume().catch(err => {
          console.error('AudioContext再開エラー:', err);
        });
      }
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      // バッファの設定
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      setFrequencyData(dataArrayRef.current);
      
      // 音声ソースの接続
      console.log('🔊 音声ソース接続');
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioElem);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      
      setIsAnalyzing(true);
      console.log('🔊 分析状態 ON');
      
      // 分析ループの開始
      const analyzeLoop = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;
        
        // 周波数データの取得
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // 平均音量レベルの計算 (0-1の範囲)
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
        }
        const average = sum / dataArrayRef.current.length / 255;
        
        // 前の値と大きく変わったときだけログ出力（デバッグ用）
        if (Math.abs(average - audioLevel) > 0.1) {
          console.log('🔊 音量レベル変化:', average.toFixed(2));
        }
        
        setAudioLevel(average);
        
        // 周波数データの更新
        setFrequencyData(new Uint8Array(dataArrayRef.current));
        
        // ループの継続
        animationFrameRef.current = requestAnimationFrame(analyzeLoop);
      };
      
      animationFrameRef.current = requestAnimationFrame(analyzeLoop);
      console.log('🔊 分析ループ開始');
      
    } catch (error) {
      console.error('音声分析の初期化エラー:', error);
      cleanup();
    }
  };
  
  // 分析停止関数
  const stopAnalyzing = cleanup;
  
  return {
    isAnalyzing,
    audioLevel,
    frequencyData,
    startAnalyzing,
    stopAnalyzing
  };
} 