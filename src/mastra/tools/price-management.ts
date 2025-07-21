import { createTool } from "@mastra/core/tools";
import axios from "axios";
import { z } from "zod";

// Schema for price data
const PriceDataSchema = z.object({
  token: z.string(),
  price: z.number(),
  timestamp: z.string(),
  change24h: z.number().optional(),
  volume24h: z.number().optional(),
  marketCap: z.number().optional(),
  // Add other price fields as needed
});

// Schema for token info
const TokenInfoSchema = z.object({
  address: z.string(),
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
  totalSupply: z.string().optional(),
  price: z.number().optional(),
  marketCap: z.number().optional(),
  volume24h: z.number().optional(),
  // Add other token info fields as needed
});

export const priceManagement = createTool({
  id: "price-management",
  description: "Price information endpoints for fetching token prices and token information",
  inputSchema: z.object({
    action: z.enum([
      "get-price",
      "get-token-info"
    ]).describe("The action to perform"),
    token: z.string().optional().describe("Token address or symbol for price queries"),
    tokens: z.array(z.string()).optional().describe("Array of token addresses or symbols for batch price queries"),
  }),
  outputSchema: z.any(),
  execute: async ({ context }) => {
    const { action, token, tokens } = context;
    const { RECALL_API_URL, RECALL_API_KEY } = process.env;

    if (!RECALL_API_URL || !RECALL_API_KEY) {
      throw new Error("RECALL_API_URL and RECALL_API_KEY environment variables are required");
    }

    const headers = { 
      Authorization: `Bearer ${RECALL_API_KEY}`,
      "Content-Type": "application/json"
    };

    try {
      switch (action) {
        case "get-price":
          const params = new URLSearchParams();
          if (token) params.append("token", token);
          if (tokens && tokens.length > 0) {
            tokens.forEach(t => params.append("tokens", t));
          }
          
          const priceUrl = `${RECALL_API_URL}/api/price${params.toString() ? `?${params.toString()}` : ""}`;
          const priceResponse = await axios.get(priceUrl, { headers });
          return priceResponse.data;

        case "get-token-info":
          if (!token) {
            throw new Error("Token address or symbol is required for get-token-info operation");
          }
          const tokenInfoParams = new URLSearchParams();
          tokenInfoParams.append("token", token);
          
          const tokenInfoUrl = `${RECALL_API_URL}/api/price/token-info?${tokenInfoParams.toString()}`;
          const tokenInfoResponse = await axios.get(tokenInfoUrl, { headers });
          return tokenInfoResponse.data;

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API request failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  },
}); 