import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Truncate long addresses or hashes
export function truncateHash(hash: string, startLength = 6, endLength = 4): string {
  if (!hash) return '';
  if (hash.length <= startLength + endLength) return hash;
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
}

// Convert hex to decimal
export function hexToDecimal(hex: string): number {
  return parseInt(hex, 16);
}

// Convert wei to ETH
export function weiToEth(wei: string | number): number {
  const weiNum = typeof wei === 'string' ? BigInt(wei) : BigInt(wei);
  return Number(weiNum) / 1e18;
}

// Format ETH value with proper decimals
export function formatEth(value: string | number, decimals = 4): string {
  const eth = typeof value === 'string' && value.startsWith('0x') 
    ? weiToEth(value) 
    : typeof value === 'number' 
    ? value 
    : weiToEth(value);
  return eth.toFixed(decimals);
}

// Format large numbers with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

// Format timestamp to readable date
export function formatTimestamp(timestamp: string | number): string {
  const ts = typeof timestamp === 'string' ? hexToDecimal(timestamp) : timestamp;
  const date = new Date(ts * 1000);
  return date.toLocaleString();
}

// Get relative time (e.g., "2 minutes ago")
export function getRelativeTime(timestamp: string | number): string {
  const ts = typeof timestamp === 'string' ? hexToDecimal(timestamp) : timestamp;
  const now = Date.now();
  const diff = now - (ts * 1000);
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Detect if string is address, tx hash, or block number/hash
export function detectSearchType(query: string): 'address' | 'tx' | 'block' | 'blockHash' | 'unknown' {
  if (!query) return 'unknown';
  
  // Remove any whitespace
  query = query.trim().toLowerCase();
  
  // Check if it's a number (block number)
  if (/^\d+$/.test(query)) {
    return 'block';
  }
  
  // Check if it's a hex with 0x prefix
  if (query.startsWith('0x')) {
    // Remove 0x prefix for validation
    const hexPart = query.slice(2);
    
    // Validate it's actually hex
    if (!/^[0-9a-f]+$/i.test(hexPart)) {
      return 'unknown';
    }
    
    // Transaction hash OR Block hash is 66 characters (0x + 64 hex chars)
    // We can't distinguish between them just by length, so we'll try both
    if (query.length === 66) {
      return 'tx'; // Default to transaction, will fallback to block if not found
    }
    // Address is 42 characters (0x + 40 hex chars)
    if (query.length === 42) {
      return 'address';
    }
  }
  
  return 'unknown';
}

// Calculate transaction size category for whale tracker
export function getTransactionSize(valueInEth: number): 'large' | 'huge' | 'mega' | null {
  if (valueInEth >= 100000) return 'mega';
  if (valueInEth >= 50000) return 'huge';
  if (valueInEth >= 10000) return 'large';
  return null;
}

// Get whale emoji based on size
export function getWhaleEmoji(size: string): string {
  switch (size) {
    case 'mega': return '🐳';
    case 'huge': return '🦈';
    case 'large': return '🐋';
    default: return '🐟';
  }
}

// Format gas price in Gwei
export function formatGwei(wei: string | number): string {
  const weiNum = typeof wei === 'string' ? BigInt(wei) : BigInt(wei);
  const gwei = Number(weiNum) / 1e9;
  return gwei.toFixed(2);
}
