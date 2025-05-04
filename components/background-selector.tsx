import { useState } from 'react';
import Image from 'next/image';
import { Settings, Check, X } from 'lucide-react';
import { Background } from '@/hooks/use-background';

type BackgroundSelectorProps = {
  availableBackgrounds: Background[];
  currentBackground: Background;
  onSelectBackground: (background: Background) => void;
};

export function BackgroundSelector({
  availableBackgrounds,
  currentBackground,
  onSelectBackground,
}: BackgroundSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="absolute right-5 bottom-5 z-20">
      {/* 設定ボタン */}
      <button
        onClick={toggleOpen}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700/70 p-2 text-gray-200 backdrop-blur-md transition hover:bg-gray-600/70"
        aria-label="背景設定"
      >
        <Settings className="h-5 w-5" />
      </button>

      {/* セレクターパネル */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-[320px] rounded-lg bg-gray-700/70 p-4 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-100">背景を選択</h3>
            <button
              onClick={toggleOpen}
              className="rounded-full p-1 text-gray-300 hover:bg-gray-600/70 hover:text-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {availableBackgrounds.map((bg) => (
              <div
                key={bg.id}
                onClick={() => onSelectBackground(bg)}
                className={`relative cursor-pointer overflow-hidden rounded-md border-2 transition ${
                  currentBackground.id === bg.id
                    ? 'border-blue-500 ring-2 ring-blue-500/50'
                    : 'border-transparent hover:border-gray-400'
                }`}
              >
                <div className="relative h-24 w-full">
                  <Image
                    src={bg.thumbnail || bg.path}
                    alt={bg.name}
                    fill
                    className="object-cover"
                  />
                  {currentBackground.id === bg.id && (
                    <div className="absolute right-1 top-1 rounded-full bg-blue-500 p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="bg-gray-700/70 p-1.5 text-center text-xs text-gray-200">
                  {bg.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 