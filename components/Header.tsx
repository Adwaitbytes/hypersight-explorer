'use client';

import Link from 'next/link';
import { Activity, Search, Moon, Sun } from 'lucide-react';
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
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
            <Activity className="w-6 h-6 text-primary" />
            <span className="text-primary">Hyperliquid Explorer</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl w-full">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Address / Txn Hash / Block"
                className="w-full px-4 py-2 pr-10 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Navigation */}
            <nav className="flex items-center gap-1">
              <Link href="/analytics" className="px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                Analytics
              </Link>
              <Link href="/whales" className="px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                Whales
              </Link>
            </nav>

            {/* Network Switcher */}
            {mounted && (
              <div className="flex items-center gap-1 bg-secondary rounded-md p-1">
                <button
                  onClick={() => setNetwork('mainnet')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                    network === 'mainnet'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Mainnet
                </button>
                <button
                  onClick={() => setNetwork('testnet')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                    network === 'testnet'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
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
                className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}