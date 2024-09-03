'use client'

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface RankDisplayProps {
  totalWeight: number;
  totalItems: number;  // 追加: 全アイテム数
}

const RankDisplay: React.FC<RankDisplayProps> = ({ totalWeight, totalItems }) => {
  const [rank, setRank] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (totalItems < 15) {
      // アイテム数が10未満の場合
      setRank('判定不可');
      setIcon('❓');
      setColor('text-gray-500');
      setProgress(0);
      setMessage('アイテムを15個以上登録するとあなたのUL玄人レベルが判定できます。');
    } else if (totalWeight < 3000) {
      setRank('先駆者');
      setIcon('🏆');
      setColor('text-purple-600');
      setProgress(100);
      setMessage('素晴らしい軽量化スキル！');
    } else if (totalWeight < 4000) {
      setRank('上級者');
      setIcon('🥇');
      setColor('text-yellow-500');
      setProgress(75);
      setMessage('あと一歩で最高ランクです！');
    } else if (totalWeight < 6000) {
      setRank('一人前');
      setIcon('🥈');
      setColor('text-gray-500');
      setProgress(50);
      setMessage('良い感じです。さらなる軽量化に挑戦しましょう！');
    } else {
      setRank('初心者');
      setIcon('🌱');
      setColor('text-green-500');
      setProgress(25);
      setMessage('まだまだ改善の余地があります。頑張りましょう！');
    }
  }, [totalWeight, totalItems]);

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-6 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-black">パッキングスキル</h2>
      <div className="flex items-center mb-4">
        <span className="text-4xl mr-4">{icon}</span>
        <div>
          <p className={`text-1xl font-bold ${color}`}>{rank}</p>
          <p className="text-3xl font-bold text-black">
            総重量: {(totalWeight / 1000).toFixed(2)} kg
            {totalItems >= 10 && ` (${totalItems}アイテム)`}
          </p>
        </div>
      </div>
      {totalItems >= 10 && (
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <motion.div
              style={{ width: `${progress}%` }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${color.replace('text', 'bg')}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            ></motion.div>
          </div>
        </div>
      )}
      <p className="text-sm text-gray-600">{message}</p>
    </motion.div>
  );
};

export default RankDisplay;
