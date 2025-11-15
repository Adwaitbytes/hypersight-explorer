'use client';

import { useQuery } from '@tanstack/react-query';
import { getLatestBlocks, getRecentTransactions } from '@/lib/lavaRpc';
import BlockCard from '@/components/BlockCard';
import TransactionCard from '@/components/TransactionCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Activity, Blocks, ArrowRightLeft } from 'lucide-react';
import { REFRESH_INTERVAL } from '@/lib/constants';

export default function Home() {
  const { data: blocks, isLoading: blocksLoading, error: blocksError } = useQuery({
    queryKey: ['latestBlocks'],
    queryFn: () => getLatestBlocks(9),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0, // Data is immediately stale
    gcTime: 0, // Don't cache data
    refetchOnMount: 'always', // Always fetch fresh data on mount
    refetchOnWindowFocus: true, // Fetch when window gains focus
  });

  const { data: transactions, isLoading: txLoading, error: txError } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: () => getRecentTransactions(9),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0, // Data is immediately stale
    gcTime: 0, // Don't cache data
    refetchOnMount: 'always', // Always fetch fresh data on mount
    refetchOnWindowFocus: true, // Fetch when window gains focus
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 sm:p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Activity className="w-6 h-6 sm:w-8 sm:h-8" />
          <h1 className="text-2xl sm:text-3xl font-bold">Hyperliquid Explorer</h1>
        </div>
        <p className="text-blue-100 text-sm sm:text-base md:text-lg">
          Real-time blockchain explorer powered by Lava Network's high-performance RPC API
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold">{blocks?.length || 0}+</div>
            <div className="text-xs sm:text-sm text-blue-100">Latest Blocks</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold">{transactions?.length || 0}+</div>
            <div className="text-xs sm:text-sm text-blue-100">Recent Transactions</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold">Live</div>
            <div className="text-xs sm:text-sm text-blue-100">Real-time Updates</div>
          </div>
        </div>
      </div>

      {/* Latest Blocks */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Blocks className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Latest Blocks
          </h2>
          <span className="text-xs sm:text-sm text-gray-500">Updates every 2 seconds</span>
        </div>

        {blocksLoading ? (
          <LoadingSkeleton />
        ) : blocksError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            Failed to load blocks. Please check your connection.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blocks?.map((block) => (
              <BlockCard key={block.hash} block={block} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            Recent Transactions
          </h2>
        </div>

        {txLoading ? (
          <LoadingSkeleton />
        ) : txError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            Failed to load transactions. Please check your connection.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transactions?.map((tx) => (
              <TransactionCard key={tx.hash} transaction={tx} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
