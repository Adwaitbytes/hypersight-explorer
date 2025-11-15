'use client';

import Link from 'next/link';
import { Activity, Search, Moon, Sun, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { detectSearchType } from '@/lib/utils';
import { useTheme } from '@/lib/themeContext';
import { useNetwork } from '@/lib/networkContext';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { network, setNetwork } = useNetwork();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    const type = detectSearchType(query);
    
    switch (type) {
      case 'block':
        router.push(`/block/${query}`);
        break;
      case 'tx':
        // For 66-character hashes, we need to check if it's a transaction or block hash
        if (query.length === 66 && query.startsWith('0x')) {
          // First try as transaction
          try {
            const response = await fetch('/api/search-hash', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ hash: query }),
            });
            const data = await response.json();
            
            if (data.type === 'transaction') {
              router.push(`/tx/${query}`);
            } else if (data.type === 'block') {
              router.push(`/block/${data.blockNumber}`);
            } else {
              alert('Hash not found on this network. Try switching between Mainnet/Testnet.');
            }
          } catch (error) {
            // Fallback: just try transaction page
            router.push(`/tx/${query}`);
          }
        } else {
          router.push(`/tx/${query}`);
        }
        break;
      case 'address':
        router.push(`/address/${query}`);
        break;
      default:
        alert('Invalid search query. Please enter:\n• Block number (e.g., 123456)\n• Full transaction hash (0x + 64 characters)\n• Address (0x + 40 characters)');
    }
    
    setSearchQuery('');
  };

  return (
    <header className="lava-gradient text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl sm:text-2xl font-bold hover:scale-105 transition-transform">
            <div className="relative">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8" />
              <div className="absolute inset-0 w-8 h-8 animate-ping opacity-20">
                <Activity className="w-8 h-8" />
              </div>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              Hyperliquid Explorer
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl w-full">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Address / Txn Hash / Block"
                className="w-full px-4 py-3 pr-12 rounded-xl text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </button>
            </div>
          </form>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <Link href="/analytics" className="px-3 py-2 hover:bg-white/20 rounded-lg transition-all font-medium flex items-center gap-2 text-sm md:text-base">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </Link>
              <Link href="/whales" className="px-3 py-2 hover:bg-white/20 rounded-lg transition-all font-medium text-sm md:text-base">
                Whales
              </Link>
            </nav>

            {/* Network Switcher */}
            {mounted && (
              <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
                <button
                  onClick={() => setNetwork('mainnet')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    network === 'mainnet'
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Mainnet
                </button>
                <button
                  onClick={() => setNetwork('testnet')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    network === 'testnet'
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Testnet
                </button>
              </div>
            )}

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2.5 hover:bg-white/20 rounded-xl transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Powered by Lava Badge */}
        <div className="flex justify-center mt-3">
          <a
            href="https://www.lavanet.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs font-medium transition-all backdrop-blur-sm network-badge"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Powered by Lava Network RPC
          </a>
        </div>
      </div>
    </header>
  );
}
