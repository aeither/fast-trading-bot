import { createTool } from "@mastra/core/tools";
import axios from "axios";
import { z } from "zod";

// Schema for agent profile
const AgentProfileSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  avatar: z.string().optional(),
  // Add other profile fields as needed
});

// Schema for balances
const BalanceSchema = z.object({
  currency: z.string(),
  available: z.number(),
  locked: z.number(),
  total: z.number(),
});

// Schema for portfolio
const PortfolioItemSchema = z.object({
  symbol: z.string(),
  quantity: z.number(),
  averagePrice: z.number(),
  currentPrice: z.number(),
  totalValue: z.number(),
  pnl: z.number(),
});

// Schema for trade
const TradeSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  side: z.enum(["buy", "sell"]),
  quantity: z.number(),
  price: z.number(),
  timestamp: z.string(),
  status: z.string(),
});

export const agentManagement = createTool({
  id: "agent-management",
  description: "Agent management endpoints for interacting with agent profile, balances, portfolio, trades, and API key management",
  inputSchema: z.object({
    action: z.enum([
      "get-profile",
      "update-profile", 
      "get-balances",
      "get-portfolio",
      "get-trades",
      "reset-api-key"
    ]).describe("The action to perform"),
    profile: AgentProfileSchema.optional().describe("Profile data for update operations"),
    limit: z.number().optional().describe("Limit for trades query"),
    offset: z.number().optional().describe("Offset for trades query"),
  }),
  outputSchema: z.any(),
  execute: async ({ context }) => {
    const { action, profile, limit, offset } = context;
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
        case "get-profile":
          const profileResponse = await axios.get(`${RECALL_API_URL}/api/agent/profile`, { headers });
          return profileResponse.data;

        case "update-profile":
          if (!profile) {
            throw new Error("Profile data is required for update operation");
          }
          const updateResponse = await axios.put(`${RECALL_API_URL}/api/agent/profile`, profile, { headers });
          return updateResponse.data;

        case "get-balances":
          const balancesResponse = await axios.get(`${RECALL_API_URL}/api/agent/balances`, { headers });
          return balancesResponse.data;

        case "get-portfolio":
          const portfolioResponse = await axios.get(`${RECALL_API_URL}/api/agent/portfolio`, { headers });
          return portfolioResponse.data;

        case "get-trades":
          const params = new URLSearchParams();
          if (limit) params.append("limit", limit.toString());
          if (offset) params.append("offset", offset.toString());
          
          const tradesUrl = `${RECALL_API_URL}/api/agent/trades${params.toString() ? `?${params.toString()}` : ""}`;
          const tradesResponse = await axios.get(tradesUrl, { headers });
          return tradesResponse.data;

        case "reset-api-key":
          const resetResponse = await axios.post(`${RECALL_API_URL}/api/agent/reset-api-key`, {}, { headers });
          return resetResponse.data;

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