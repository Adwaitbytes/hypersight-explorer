'use client';

import Link from 'next/link';
import { Transaction } from '@/lib/types';
import { truncateHash, formatEth, getRelativeTime, hexToDecimal, copyToClipboard } from '@/lib/utils';
import { ArrowRight, CheckCircle, XCircle, Copy } from 'lucide-react';
import { useState } from 'react';

interface TransactionCardProps {
  transaction: Transaction;
  showStatus?: boolean;
}

export default function TransactionCard({ transaction, showStatus = false }: TransactionCardProps) {
  const [copied, setCopied] = useState(false);
  const value = formatEth(transaction.value);
  const blockNumber = transaction.blockNumber ? hexToDecimal(transaction.blockNumber) : 'Pending';

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await copyToClipboard(transaction.hash);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Link href={`/tx/${transaction.hash}`}>
      <div className="bg-white dark:bg-card rounded-xl shadow-md hover:shadow-xl transition-all p-5 border border-gray-200 dark:border-border cursor-pointer card-hover group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">Tx</span>
            <span className="font-mono text-sm text-blue-600 dark:text-blue-400 truncate" title={transaction.hash}>
              {truncateHash(transaction.hash, 10, 8)}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Copy full transaction hash"
            >
              {copied ? (
                <CheckCircle className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              )}
            </button>
          </div>
          {showStatus && (
            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <CheckCircle className="w-3 h-3" />
              Success
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400 text-xs block mb-1">From</span>
            <span className="font-mono text-xs">{truncateHash(transaction.from)}</span>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>

          <div>
            <span className="text-gray-600 dark:text-gray-400 text-xs block mb-1">To</span>
            <span className="font-mono text-xs">
              {transaction.to ? truncateHash(transaction.to) : 'Contract Creation'}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Value: <span className="font-semibold text-gray-900 dark:text-white">{value} ETH</span>
          </span>
          <span className="text-xs text-gray-500">
            Block: <span className="text-blue-600">#{blockNumber}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
