'use client';

import React from 'react';

// 検証項目のデータ
const verificationItems = [
  { id: 1, title: "財務健全性", description: "NPV・IRR・キャッシュフロー試算" },
  { id: 2, title: "規制チェック", description: "薬機法／FDA SaMD区分確定" },
  { id: 3, title: "データプライバシー", description: "APPI・GDPR・HIPAA準拠" },
  { id: 4, title: "環境規制", description: "CO₂排出・ESG障壁回避" },
  { id: 5, title: "撤退基準", description: "KPI未達時の損失最小撤収条件" },
  { id: 6, title: "サプライチェーン", description: "部材調達性・代替ルート確保" },
  { id: 7, title: "診断性能ベンチマーク", description: "感度・特異度の臨床優位性" },
  { id: 8, title: "医療過誤・賠償責任リスク", description: "誤診責任範囲と保険評価" },
  { id: 9, title: "多施設・外部コホート検証", description: "モデル汎化性能保証" },
  { id: 10, title: "ユーザトレーニング要件", description: "医師・技師教育とCME単位化" },
  { id: 11, title: "倫理委員会／IRB承認手続き", description: "臨床データ利用倫理確認" },
  { id: 12, title: "保守・DevOps体制負荷", description: "運用コスト・SLA維持算定" },
  { id: 13, title: "サイバーセキュリティ", description: "FDAガイドライン準拠セキュリティ" },
  { id: 14, title: "アノテーションパイプライン拡張性", description: "半自動ラベル付け継続学習" },
  { id: 15, title: "スケーラビリティ設計", description: "クラウド／エッジ構成最適化" },
  { id: 16, title: "ナレッジ蓄積", description: "構造化データ保存・再学習促進" },
];

export default function TestMarketingGrid() {
  return (
    <div className="w-full min-h-full bg-white text-black p-6">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          CancerBridge テストマーケティング検証
        </h1>
        <p className="text-gray-600">
          ソフトバンク経済圏での実現可能性を多角的に検証
        </p>
      </div>

      {/* 4×4 グリッド */}
      <div className="grid grid-cols-4 gap-4 max-w-7xl mx-auto">
        {verificationItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
            style={{ aspectRatio: '4/3' }}
          >
            {/* カード番号 */}
            <div className="text-sm text-gray-500 mb-2">#{item.id}</div>
            
            {/* タイトル */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">
              {item.title}
            </h3>
            
            {/* 説明 */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* レスポンシブ用のCSS */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
} 