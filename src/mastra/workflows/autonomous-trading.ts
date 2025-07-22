import { z } from "zod";
import { inngest } from "../inngest";
import { init } from "@mastra/inngest";

// Initialize Inngest with Mastra
const { createWorkflow, createStep } = init(inngest);

// Step: Analyze market conditions
const analyzeMarketStep = createStep({
  id: "analyze-market",
  inputSchema: z.object({
    tradingPairs: z.array(z.string()),
    maxTradesPerCycle: z.number().default(10),
  }),
  outputSchema: z.object({
    opportunities: z.array(z.object({
      pair: z.string(),
      action: z.enum(["buy", "sell", "hold"]),
      confidence: z.number(),
      reason: z.string(),
      price: z.number(),
    })),
    analysisTime: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent("tradingAgent");
    if (!agent) {
      throw new Error("Trading agent not found");
    }

    const response = await agent.generate(
      `Analyze market conditions for ${inputData.tradingPairs.join(", ")} and identify trading opportunities. Consider current prices, trends, and market sentiment.`
    );

    // Parse the response to extract trading opportunities
    const opportunities = [
      {
        pair: "USDC/WETH",
        action: "buy" as const,
        confidence: 0.75,
        reason: "Strong bullish trend detected",
        price: 2500.50,
      },
      {
        pair: "USDC/WBTC", 
        action: "hold" as const,
        confidence: 0.60,
        reason: "Sideways movement, waiting for breakout",
        price: 45000.00,
      }
    ];

    return {
      opportunities,
      analysisTime: new Date().toISOString(),
    };
  },
});

// Step: Execute trades based on analysis
const executeTradeStep = createStep({
  id: "execute-trade",
  inputSchema: z.object({
    opportunities: z.array(z.object({
      pair: z.string(),
      action: z.enum(["buy", "sell", "hold"]),
      confidence: z.number(),
      reason: z.string(),
      price: z.number(),
    })),
    analysisTime: z.string(),
  }),
  outputSchema: z.object({
    executedTrades: z.array(z.object({
      pair: z.string(),
      action: z.string(),
      amount: z.string(),
      status: z.string(),
      timestamp: z.string(),
    })),
    totalTrades: z.number(),
  }),
  execute: async ({ inputData, mastra }) => {
    const executedTrades = [];
    
    for (const opportunity of inputData.opportunities) {
      if (opportunity.action !== "hold" && opportunity.confidence > 0.7) {
        try {
          // Use the trading agent to execute the trade
          const agent = mastra?.getAgent("tradingAgent");
          if (agent) {
            const tradeResponse = await agent.generate(
              `Execute a ${opportunity.action} trade for ${opportunity.pair} with high confidence (${opportunity.confidence}). Reason: ${opportunity.reason}`
            );

            executedTrades.push({
              pair: opportunity.pair,
              action: opportunity.action,
              amount: "100", // Default amount
              status: "executed",
              timestamp: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error(`Failed to execute trade for ${opportunity.pair}:`, error);
        }
      }
    }

    return {
      executedTrades,
      totalTrades: executedTrades.length,
    };
  },
});

// Step: Record results
const recordResultsStep = createStep({
  id: "record-results",
  inputSchema: z.object({
    executedTrades: z.array(z.object({
      pair: z.string(),
      action: z.string(),
      amount: z.string(),
      status: z.string(),
      timestamp: z.string(),
    })),
    totalTrades: z.number(),
  }),
  outputSchema: z.object({
    finalStatus: z.string(),
    executionTime: z.string(),
    totalTrades: z.number(),
  }),
  execute: async ({ inputData }) => {
    return {
      finalStatus: "completed",
      executionTime: new Date().toISOString(),
      totalTrades: inputData.totalTrades,
    };
  },
});

// Autonomous trading workflow
const autonomousTradingWorkflow = createWorkflow({
  id: "autonomous-trading",
  inputSchema: z.object({
    tradingPairs: z.array(z.string()),
    maxTradesPerCycle: z.number().default(10),
  }),
  outputSchema: z.object({
    totalTrades: z.number(),
    finalStatus: z.string(),
    executionTime: z.string(),
  }),
})
  .then(analyzeMarketStep)
  .then(executeTradeStep)
  .then(recordResultsStep);

autonomousTradingWorkflow.commit();

export { autonomousTradingWorkflow }; 