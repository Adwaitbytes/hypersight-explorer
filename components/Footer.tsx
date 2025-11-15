'use client';

import { Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-3">Hyperliquid Explorer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time blockchain explorer for Hyperliquid powered by Lava Network's high-performance RPC API.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  Home
                </a>
              </li>
              <li>
                <a href="/analytics" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  Analytics
                </a>
              </li>
              <li>
                <a href="/whales" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                  Whale Tracker
                </a>
              </li>
            </ul>
          </div>

          {/* Powered By */}
          <div>
            <h3 className="font-bold text-lg mb-3">Powered By</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.lavanet.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                >
                  Lava Network RPC
                </a>
              </li>
              <li>
                <a
                  href="https://hyperliquid.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                >
                  Hyperliquid
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 Hyperliquid Explorer. Built for HyperEVM Hackathon.
          </p>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
