"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BarChart3, Loader2 } from 'lucide-react';

export default function MarketResearch() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [isLoading, setIsLoading] = useState(true);
  const [marketData, setMarketData] = useState({
    marketSize: '',
    competitors: '',
    opportunities: '',
    challenges: ''
  });

  useEffect(() => {
    if (query) {
      // 市場調査データを取得
      fetchMarketData(query);
    }
  }, [query]);

  const fetchMarketData = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/market-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('市場調査データの取得に失敗しました');
      }

      const data = await response.json();
      setMarketData(data);
    } catch (error) {
      console.error('市場調査エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <BarChart3 className="h-6 w-6 text-white" />
          <h1 className="text-2xl font-bold text-white">市場調査結果</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {/* 市場規模 */}
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4">市場規模</h2>
              <div className="text-gray-300 whitespace-pre-wrap">
                {marketData.marketSize}
              </div>
            </div>

            {/* 競合分析 */}
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4">競合分析</h2>
              <div className="text-gray-300 whitespace-pre-wrap">
                {marketData.competitors}
              </div>
            </div>

            {/* 機会 */}
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4">機会</h2>
              <div className="text-gray-300 whitespace-pre-wrap">
                {marketData.opportunities}
              </div>
            </div>

            {/* 課題 */}
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4">課題</h2>
              <div className="text-gray-300 whitespace-pre-wrap">
                {marketData.challenges}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 