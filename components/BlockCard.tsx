'use client';

import Link from 'next/link';
import { Block } from '@/lib/types';
import { hexToDecimal, formatTimestamp, getRelativeTime, truncateHash } from '@/lib/utils';
import { Clock, Hash, Box, Zap } from 'lucide-react';

interface BlockCardProps {
  block: Block;
}

export default function BlockCard({ block }: BlockCardProps) {
  const blockNumber = hexToDecimal(block.number);
  const txCount = Array.isArray(block.transactions) ? block.transactions.length : 0;
  const timestamp = formatTimestamp(block.timestamp);
  const relativeTime = getRelativeTime(block.timestamp);

  return (
    <Link href={`/block/${blockNumber}`}>
      <div className="bg-white dark:bg-card rounded-xl shadow-md hover:shadow-xl transition-all p-5 border border-gray-200 dark:border-border cursor-pointer card-hover group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
              <Box className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              #{blockNumber}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            {relativeTime}
          </span>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Hash className="w-3 h-3" />
              Hash:
            </span>
            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {truncateHash(block.hash)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Transactions:</span>
            <span className="font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
              {txCount} txns
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Gas Used:
            </span>
            <span className="font-mono text-xs">{hexToDecimal(block.gasUsed).toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-xs pt-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">{timestamp}</span>
          </div>
        </div>

        {/* Gradient border effect on hover */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        </div>
      </div>
    </Link>
  );
}
