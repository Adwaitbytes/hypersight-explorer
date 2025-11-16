'use client';

import { useQuery } from '@tanstack/react-query';
import { getTransaction, getTransactionReceipt } from '@/lib/lavaRpc';
import { hexToDecimal, formatEth, formatGwei } from '@/lib/utils';
import CopyButton from '@/components/CopyButton';
import Link from 'next/link';
import { ArrowLeft, ArrowRightLeft, CheckCircle, XCircle, AlertCircle, Hash, Clock } from 'lucide-react';
import { formatTimestamp, getRelativeTime } from '@/lib/utils';

export default function TransactionPage({ params }: { params: { hash: string } }) {
  const { hash } = params;

  const { data: tx, isLoading, error } = useQuery({
    queryKey: ['transaction', hash],
    queryFn: () => getTransaction(hash),
    staleTime: 0,
    gcTime: 0,
  });

  const { data: receipt } = useQuery({
    queryKey: ['transactionReceipt', hash],
    queryFn: () => getTransactionReceipt(hash),
    enabled: !!tx, // Only fetch receipt if transaction exists
  });

  const blockNumber = tx?.blockNumber ? hexToDecimal(tx.blockNumber) : null;
  const isSuccess = receipt?.status === '0x1';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !tx) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-600">
        <h2 className="text-xl font-bold mb-2">Transaction Not Found</h2>
        <p>Could not find transaction with hash {hash}. Please check the hash and try again.</p>
        <Link href="/" className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      {/* Transaction Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <ArrowRightLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Transaction</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {tx.blockNumber ? `Block #${blockNumber}` : 'Pending'} • {tx.blockNumber && getRelativeTime(tx.blockNumber)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="md:col-span-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Transaction Hash</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm break-all">{tx.hash}</span>
                <CopyButton text={tx.hash} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Status</span>
              <div className="flex items-center gap-2">
                {receipt ? (
                  isSuccess ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Success
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600">
                      <XCircle className="w-4 h-4" />
                      Failed
                    </span>
                  )
                ) : (
                  <span className="flex items-center gap-1 text-yellow-600">
                    <AlertCircle className="w-4 h-4" />
                    Pending
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Block</span>
              <Link href={`/block/${blockNumber}`} className="text-blue-600 hover:underline font-semibold">
                #{blockNumber}
              </Link>
            </div>

            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Value</span>
              <span className="font-semibold text-lg">{formatEth(tx.value)} ETH</span>
            </div>

            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">From</span>
              <div className="flex items-center gap-2">
                <Link href={`/address/${tx.from}`} className="font-mono text-sm text-blue-600 hover:underline">
                  {tx.from}
                </Link>
                <CopyButton text={tx.from} />
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">To</span>
              <div className="flex items-center gap-2">
                {tx.to ? (
                  <>
                    <Link href={`/address/${tx.to}`} className="font-mono text-sm text-blue-600 hover:underline">
                      {tx.to}
                    </Link>
                    <CopyButton text={tx.to} />
                  </>
                ) : (
                  <span className="text-gray-500">Contract Creation</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gas Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4">Gas Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Gas Limit</span>
            <span className="font-semibold">{hexToDecimal(tx.gas).toLocaleString()}</span>
          </div>

          {receipt && (
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Gas Used</span>
              <span className="font-semibold">{hexToDecimal(receipt.gasUsed).toLocaleString()}</span>
            </div>
          )}

          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Gas Price</span>
            <span className="font-semibold">{formatGwei(tx.gasPrice)} Gwei</span>
          </div>
        </div>
      </div>

      {/* Input Data */}
      {tx.input && tx.input !== '0x' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Input Data</h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 overflow-x-auto">
            <code className="text-xs font-mono break-all">{tx.input}</code>
          </div>
        </div>
      )}
    </div>
  );
}