export const REFRESH_INTERVAL = 5000; // 5 seconds
export const BLOCKS_PER_PAGE = 10;
export const TRANSACTIONS_PER_PAGE = 20;
export const WHALE_THRESHOLD_LARGE = 10000; // ETH
export const WHALE_THRESHOLD_HUGE = 50000; // ETH
export const WHALE_THRESHOLD_MEGA = 100000; // ETH

export const TRANSACTION_STATUS = {
  SUCCESS: '0x1',
  FAILED: '0x0',
} as const;

export const EXPLORER_NAME = 'Hyperliquid Explorer';
export const EXPLORER_DESCRIPTION = 'Real-time blockchain explorer for Hyperliquid powered by Lava Network';
