'use client';

import { useQuery } from '@tanstack/react-query';
import { getTransaction, getTransactionReceipt } from '@/lib/lavaRpc';
import { hexToDecimal, formatTimestamp, formatEth, truncateHash, formatGwei, getRelativeTime } from '@/lib/utils';
import CopyButton from '@/components/CopyButton';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function TransactionDetailPage({ params }: { params: { hash: string } }) {
  const { hash } = params;
  
  const { data: tx, isLoading: txLoading, error: txError } = useQuery({
    queryKey: ['transaction', hash],
    queryFn: async () => {
      const result = await getTransaction(hash);
      console.log('Transaction result:', result); // Debug log
      if (!result) {
        throw new Error('Transaction not found');
      }
      return result;
    },
    retry: false,
  });

  const { data: receipt, isLoading: receiptLoading } = useQuery({
    queryKey: ['receipt', hash],
    queryFn: () => getTransactionReceipt(hash),
    enabled: !!tx,
  });

  if (txLoading || receiptLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading transaction details...</p>
      </div>
    );
  }

  if (txError || !tx) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">Transaction Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">The transaction hash doesn't exist on this network.</p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-6 text-left">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">💡 Troubleshooting Tips:</p>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold">1.</span>
                <span><strong>Wrong Network?</strong> Check if you're on Mainnet or Testnet (toggle in header)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold">2.</span>
                <span><strong>Full Hash Required:</strong> Transaction hash must be 66 characters (0x + 64 hex characters)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold">3.</span>
                <span><strong>Pending Transaction:</strong> Transaction might not be mined yet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold">4.</span>
                <span><strong>Copy from Dashboard:</strong> Use the copy icon on transaction cards to get the full hash</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Searched for:</p>
            <code className="text-xs font-mono break-all text-gray-800 dark:text-gray-200">{hash}</code>
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

  const isSuccess = receipt && receipt.status === '0x1';
  const blockNumber = tx.blockNumber ? hexToDecimal(tx.blockNumber) : 'Pending';

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Transactions
      </Link>

      {/* Transaction Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Transaction Details</h1>
            <p className="font-mono text-sm text-gray-600 dark:text-gray-400">{tx.hash}</p>
          </div>
          {receipt && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isSuccess 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}>
              {isSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Success</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">Failed</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4">Overview</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Transaction Hash</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm break-all">{tx.hash}</span>
                <CopyButton text={tx.hash} label="hash" />
              </div>
            </div>

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
                <CopyButton text={tx.from} label="address" />
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
                    <CopyButton text={tx.to} label="address" />
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
