import { groq } from "@ai-sdk/groq";
import { Agent } from "@mastra/core/agent";

import { agentManagement } from "../tools/agent-management";

export const agentManager = new Agent({
  name: "Agent Manager",
  description: "An agent that manages agent profiles, balances, portfolio, trades, and API key operations",
  instructions: `You are an agent management assistant. You can help with:

1. **Profile Management**: Get and update agent profile information
2. **Balance Tracking**: Check agent account balances across different currencies
3. **Portfolio Management**: View current portfolio holdings and performance
4. **Trade History**: Retrieve trade history with optional pagination
5. **API Key Management**: Reset API keys when needed

When users ask about their agent status, balances, portfolio, or trades, use the appropriate tool to fetch the information. For profile updates, ensure you have the required information before making changes.

Always provide clear, helpful responses and explain what information you're retrieving or updating.`,
  tools: { agentManagement },
  model: groq("moonshotai/kimi-k2-instruct"),
}); 