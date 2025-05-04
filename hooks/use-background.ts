import { useState, useEffect } from 'react';

// 利用可能な背景のリスト
export const availableBackgrounds = [
  {
    id: 'default',
    name: 'デフォルト (山)',
    path: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
    thumbnail: '/backgrounds/thumb-mountain.jpg',
  },
  {
    id: 'goldrush',
    name: 'GOLD RUSH',
    path: '/backgrounds/GOLDRUSH.jpg',
    thumbnail: '/backgrounds/thumb-goldrush.jpg',
  },
  {
    id: 'ocean',
    name: '深海',
    path: '/backgrounds/ocean.jpg',
    thumbnail: '/backgrounds/thumb-ocean.jpg',
  },
  {
    id: 'space',
    name: '宇宙',
    path: '/backgrounds/space.jpg',
    thumbnail: '/backgrounds/thumb-space.jpg',
  },
  {
    id: 'forest',
    name: '森林',
    path: '/backgrounds/forest.jpg',
    thumbnail: '/backgrounds/thumb-forest.jpg',
  },
  {
    id: 'city',
    name: '都市',
    path: '/backgrounds/city.jpg',
    thumbnail: '/backgrounds/thumb-city.jpg',
  },
];

export type Background = {
  id: string;
  name: string;
  path: string;
  thumbnail: string;
};

export function useBackground() {
  // サーバーサイドレンダリングとクライアントサイドレンダリングの初期値を一致させるために
  // 常に同じデフォルト値から始める
  const [background, setBackground] = useState<Background>(availableBackgrounds[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  // クライアントサイドでのみローカルストレージから背景設定を取得
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBackground = localStorage.getItem('selectedBackground');
      if (savedBackground) {
        try {
          const parsed = JSON.parse(savedBackground);
          setBackground(parsed);
        } catch (e) {
          console.error('背景設定の読み込みに失敗しました:', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // 選択した背景をローカルストレージに保存
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      localStorage.setItem('selectedBackground', JSON.stringify(background));
    }
  }, [background, isLoaded]);

  // 背景を変更する関数
  const changeBackground = (newBackground: Background) => {
    setBackground(newBackground);
  };

  return {
    background,
    availableBackgrounds,
    changeBackground,
  };
} 