'use client';

import { useQuery } from '@tanstack/react-query';
import { getBlockByNumber, getTransaction, getTransactionReceipt } from '@/lib/lavaRpc';
import { hexToDecimal, formatTimestamp, formatEth, truncateHash, getRelativeTime } from '@/lib/utils';
import CopyButton from '@/components/CopyButton';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock, Coins, Fuel } from 'lucide-react';

export default function BlockDetailPage({ params }: { params: { blockNumber: string } }) {
  const { blockNumber } = params;
  
  const { data: block, isLoading, error } = useQuery({
    queryKey: ['block', blockNumber],
    queryFn: async () => {
      const result = await getBlockByNumber(parseInt(blockNumber));
      if (!result) {
        throw new Error('Block not found');
      }
      return result;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading block details...</p>
      </div>
    );
  }

  if (error || !block) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">Block Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The block you're looking for doesn't exist or hasn't been mined yet.</p>
          
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Searched for:</p>
            <code className="text-xs font-mono text-gray-800 dark:text-gray-200">Block #{blockNumber}</code>
          </div>
          
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const txCount = Array.isArray(block.transactions) ? block.transactions.length : 0;
  const timestamp = formatTimestamp(block.timestamp);
  const relativeTime = getRelativeTime(block.timestamp);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Blocks
      </Link>

      {/* Block Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Block #{hexToDecimal(block.number)}</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {timestamp} ({relativeTime})
        </p>
      </div>

      {/* Block Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Block Details</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="md:col-span-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Block Hash</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm break-all">{block.hash}</span>
                <CopyButton text={block.hash} label="hash" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Parent Hash</span>
              <div className="flex items-center gap-2">
                <Link 
                  href={`/block/${hexToDecimal(block.number) - 1}`}
                  className="font-mono text-sm break-all text-blue-600 dark:text-blue-400 hover:underline"
                  title="Click to view previous block"
                >
                  {truncateHash(block.parentHash, 20, 20)}
                </Link>
                <CopyButton text={block.parentHash} />
                <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                  (Click to view Block #{hexToDecimal(block.number) - 1})
                </span>
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Miner</span>
              <div className="flex items-center gap-2">
                {block.miner === '0x0000000000000000000000000000000000000000' ? (
                  <div className="flex flex-col">
                    <span className="font-mono text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-all">
                      {truncateHash(block.miner)}
                    </span>
                    <span className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      Hyperliquid uses Proof of Stake (no traditional miner)
                    </span>
                  </div>
                ) : (
                  <>
                    <Link href={`/address/${block.miner}`} className="font-mono text-sm text-blue-600 hover:underline">
                      {truncateHash(block.miner)}
                    </Link>
                    <CopyButton text={block.miner} />
                  </>
                )}
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Transactions</span>
              <span className="font-semibold text-green-600">{txCount} transactions</span>
            </div>

            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Gas Used</span>
              <span className="font-semibold">{hexToDecimal(block.gasUsed).toLocaleString()}</span>
            </div>

            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Gas Limit</span>
              <span className="font-semibold">{hexToDecimal(block.gasLimit).toLocaleString()}</span>
            </div>

            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Block Size</span>
              <span className="font-semibold">{hexToDecimal(block.size).toLocaleString()} bytes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      {txCount > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Transactions ({txCount})</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tx Hash</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">From</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {Array.isArray(block.transactions) && block.transactions.map((tx: any) => (
                  <tr key={tx.hash} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <Link href={`/tx/${tx.hash}`} className="font-mono text-sm text-blue-600 hover:underline">
                        {truncateHash(tx.hash)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/address/${tx.from}`} className="font-mono text-sm text-blue-600 hover:underline">
                        {truncateHash(tx.from)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {tx.to ? (
                        <Link href={`/address/${tx.to}`} className="font-mono text-sm text-blue-600 hover:underline">
                          {truncateHash(tx.to)}
                        </Link>
                      ) : (
                        <span className="text-gray-500 text-sm">Contract Creation</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">{formatEth(tx.value)} ETH</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
