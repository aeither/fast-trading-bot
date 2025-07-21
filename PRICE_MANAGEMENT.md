# Price Management Tool

This document describes the new price management tool that has been added to the fast-trading-bot project using Mastra MCP.

## Overview

The price management tool provides a comprehensive interface for fetching token prices and token information. It implements the price information endpoints specified in the API.

## Features

### 1. Token Price Information
- **Get Price**: Retrieve current prices for individual tokens or batch prices for multiple tokens
- Supports both single token and batch token queries
- Returns price data including current price, 24h changes, volume, and market cap

### 2. Token Information
- **Get Token Info**: Retrieve detailed information about tokens
- Provides metadata including symbol, name, decimals, total supply
- Includes market data like price, market cap, and trading volume

## Usage

### Environment Variables

The tool uses the existing environment variables that are already configured for the Recall API:

```bash
RECALL_API_URL=https://your-recall-api-endpoint.com
RECALL_API_KEY=your-recall-api-key
```

### Using the Price Manager

The price manager is available as a Mastra agent that can be invoked to perform price-related operations:

```typescript
// The price manager is automatically available in your Mastra instance
const agent = mastra.getAgent("priceManager");

// Example: Get price for USDC
const response = await agent.stream([
  { role: "user", content: "What's the current price of USDC?" }
]);
```

### Direct Tool Usage

You can also use the tool directly in your code:

```typescript
import { priceManagement } from "./src/mastra/tools/price-management";

// Get price for a single token
const price = await priceManagement.execute({ 
  action: "get-price",
  token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" // USDC address
});

// Get prices for multiple tokens
const prices = await priceManagement.execute({ 
  action: "get-price",
  tokens: [
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"  // WBTC
  ]
});

// Get all prices (no specific tokens)
const allPrices = await priceManagement.execute({ 
  action: "get-price"
});

// Get token information
const tokenInfo = await priceManagement.execute({ 
  action: "get-token-info",
  token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" // USDC address
});

// Get token information by symbol
const tokenInfoBySymbol = await priceManagement.execute({ 
  action: "get-token-info",
  token: "USDC"
});
```

## API Endpoints

The tool implements the following API endpoints:

- `GET /api/price` - Get token prices (single or batch)
- `GET /api/price/token-info` - Get detailed token information

## Data Schemas

### Price Data Schema
```typescript
{
  token: string;
  price: number;
  timestamp: string;
  change24h?: number;
  volume24h?: number;
  marketCap?: number;
}
```

### Token Info Schema
```typescript
{
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  totalSupply?: string;
  price?: number;
  marketCap?: number;
  volume24h?: number;
}
```

## Common Token Addresses

For reference, here are some common token addresses you can use:

### Ethereum Mainnet
- **USDC**: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- **WETH**: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- **WBTC**: `0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599`

### Solana
- **SOL**: `Sol11111111111111111111111111111111111111112`

## Error Handling

The tool includes comprehensive error handling:

- Validates required environment variables
- Handles API request failures with descriptive error messages
- Validates required parameters (token for token-info operations)
- Provides clear error messages for missing or invalid data

## Integration with Mastra

The price management tool is fully integrated with the Mastra framework:

- Uses Mastra's tool creation utilities
- Follows Mastra's patterns for tool definition
- Integrates with Mastra's agent system
- Supports Mastra's workflow capabilities

## Available Agents

Your Mastra instance now includes four agents:

1. **tradingAgent** - For executing trades on the Recall Network
2. **agentManager** - For managing agent profiles, balances, portfolio, and trades
3. **competitionManager** - For managing competition information and agent participation
4. **priceManager** - For fetching token prices and token information

## Use Cases

### Trading Decisions
```typescript
// Get current prices before making trading decisions
const prices = await priceManagement.execute({
  action: "get-price",
  tokens: ["USDC", "WETH", "WBTC"]
});
```

### Portfolio Analysis
```typescript
// Get detailed token information for portfolio analysis
const tokenInfo = await priceManagement.execute({
  action: "get-token-info",
  token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
});
```

### Market Monitoring
```typescript
// Monitor price changes and market data
const priceData = await priceManagement.execute({
  action: "get-price",
  token: "WETH"
});
```

## Next Steps

To use this tool effectively:

1. Ensure your Recall API credentials are properly configured
2. Test the tool with your price API endpoints
3. Integrate it into your trading workflows for price-aware decisions
4. Use the price manager agent for natural language price queries

The tool is designed to be flexible and can be easily extended with additional functionality as your price data needs evolve. 