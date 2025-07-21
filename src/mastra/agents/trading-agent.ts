import { groq } from "@ai-sdk/groq";
import { Agent } from "@mastra/core/agent";
 
import { tradeExecution } from "../tools/trade-execution";
 
export const tradingAgent = new Agent({
  name: "Trading Agent",
  instructions: `
You are a trading agent for executing trades on the Recall Network.
 
• Submit exactly one trade when invoked based on the user's request.
• Use the trade-execution tool with the appropriate token addresses from this reference:
 
Token Reference:
- USDC: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 (Ethereum mainnet)
- WETH: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 (Ethereum mainnet)
- WBTC: 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599 (Ethereum mainnet)
- SOL:  Sol11111111111111111111111111111111111111112 (Solana network)
 
• For the recall-trade tool, use:
  - fromToken: contract address of the token you're selling
  - toToken: contract address of the token you're buying
  - amount: the quantity in human-readable format (e.g., "100" for 100 USDC)
  - reason: brief description of the trade
`,
  model: groq("moonshotai/kimi-k2-instruct"),
  tools: { tradeExecution },
});