import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getLatestBlockNumber, getGasPrice, getChainId } from '@/lib/lavaRpc';
import { getHyperliquidTokenPrice, getLavaNetworkTokenPrice, getSocialMediaData } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get live blockchain data
    let liveData = '';
    try {
      const latestBlock = await getLatestBlockNumber();
      const gasPrice = await getGasPrice();
      const chainId = await getChainId();
      
      liveData = `
        Current Blockchain Data:
        - Latest Block Number: ${latestBlock}
        - Current Gas Price: ${gasPrice} wei
        - Chain ID: ${chainId}
      `;
    } catch (error) {
      console.error('Error fetching live data:', error);
      liveData = 'Unable to fetch current blockchain data.';
    }

    // Get live market data
    let marketData = '';
    try {
      const hyperliquidData = await getHyperliquidTokenPrice();
      const lavaData = await getLavaNetworkTokenPrice();
      
      if (hyperliquidData) {
        marketData += `
          Hyperliquid (HYPE) Token Data:
          - Price: $${hyperliquidData.usd.toFixed(2)} USD
          - 24h Change: ${hyperliquidData.usd_24h_change.toFixed(2)}%
          - Market Cap: $${(hyperliquidData.market_cap / 1000000).toFixed(2)}M
          - 24h Volume: $${(hyperliquidData.volume_24h / 1000000).toFixed(2)}M
        `;
      }
      
      if (lavaData) {
        marketData += `
          Lava Network (LAVA) Token Data:
          - Price: $${lavaData.usd.toFixed(4)} USD
          - 24h Change: ${lavaData.usd_24h_change.toFixed(2)}%
          - Market Cap: $${(lavaData.market_cap / 1000000).toFixed(2)}M
          - 24h Volume: $${(lavaData.volume_24h / 1000000).toFixed(2)}M
        `;
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      marketData = 'Unable to fetch current market data.';
    }

    // Get social media data
    let socialData = '';
    try {
      const socialMediaData = await getSocialMediaData();
      if (socialMediaData) {
        socialData = `
          Social Media Links:
          
          Hyperliquid:
          - Website: ${socialMediaData.hyperliquid.website}
          - Twitter: ${socialMediaData.hyperliquid.twitter}
          - Discord: ${socialMediaData.hyperliquid.discord}
          - Telegram: ${socialMediaData.hyperliquid.telegram}
          - Blog: ${socialMediaData.hyperliquid.blog}
          
          Lava Network:
          - Website: ${socialMediaData.lavanet.website}
          - Twitter: ${socialMediaData.lavanet.twitter}
          - Discord: ${socialMediaData.lavanet.discord}
          - Telegram: ${socialMediaData.lavanet.telegram}
          - Blog: ${socialMediaData.lavanet.blog}
        `;
      }
    } catch (error) {
      console.error('Error fetching social media data:', error);
      socialData = 'Unable to fetch social media data.';
    }

    // Gemini API configuration with the correct endpoint
    const API_KEY = 'AIzaSyBHdAw49BZOONfnG9gAnets_0aTsUQ2Hg8';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    // Enhanced context for the blockchain explorer with live data
    const context = `
      You are an AI assistant for Hyperliquid Explorer, a blockchain explorer for the Hyperliquid network powered by Lava Network's high-performance RPC infrastructure.
      
      About Hyperliquid:
      Hyperliquid is a high-performance decentralized exchange (DEX) built on the Hyperliquid network. It offers zero-fees, low-latency trading with a focus on professional traders and market makers.
      
      About Lava Network:
      Lava Network provides high-performance RPC infrastructure that powers the Hyperliquid Explorer. Lava aggregates data providers and directs RPC traffic based on speed and reliability, offering ultra-reliable service for blockchain applications.
      
      ${liveData}
      
      ${marketData}
      
      ${socialData}
      
      Use the live blockchain, market, and social media data when relevant to answer questions.
      Keep responses concise, accurate, and focused on blockchain topics.
      If asked about general topics outside blockchain, politely redirect to blockchain-related queries.
      
      User Query: ${message}
    `;

    // Prepare the request to Gemini API
    const response = await axios.post(API_URL, {
      contents: [{
        parts: [{
          text: context
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': API_KEY
      }
    });

    // Extract the response from Gemini
    const aiResponse = response.data.candidates[0].content.parts[0].text;

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error('Chatbot API Error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}