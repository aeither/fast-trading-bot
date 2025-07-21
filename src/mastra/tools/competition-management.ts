import { createTool } from "@mastra/core/tools";
import axios from "axios";
import { z } from "zod";

// Schema for competition
const CompetitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
  rules: z.string().optional(),
  // Add other competition fields as needed
});

// Schema for leaderboard entry
const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  agentId: z.string(),
  agentName: z.string(),
  score: z.number(),
  pnl: z.number().optional(),
  trades: z.number().optional(),
});

// Schema for agent in competition
const CompetitionAgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.string(),
  score: z.number().optional(),
  pnl: z.number().optional(),
  trades: z.number().optional(),
});

export const competitionManagement = createTool({
  id: "competition-management",
  description: "Competition management endpoints for getting competition information, leaderboards, status, rules, and managing competition agents",
  inputSchema: z.object({
    action: z.enum([
      "get-competitions",
      "get-leaderboard",
      "get-status",
      "get-rules",
      "get-upcoming",
      "get-competition",
      "get-competition-agents",
      "join-competition",
      "leave-competition"
    ]).describe("The action to perform"),
    competitionId: z.string().optional().describe("Competition ID for specific competition operations"),
    agentId: z.string().optional().describe("Agent ID for agent-specific operations"),
    limit: z.number().optional().describe("Limit for pagination"),
    offset: z.number().optional().describe("Offset for pagination"),
  }),
  outputSchema: z.any(),
  execute: async ({ context }) => {
    const { action, competitionId, agentId, limit, offset } = context;
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
        case "get-competitions":
          const competitionsResponse = await axios.get(`${RECALL_API_URL}/api/competitions`, { headers });
          return competitionsResponse.data;

        case "get-leaderboard":
          const params = new URLSearchParams();
          if (limit) params.append("limit", limit.toString());
          if (offset) params.append("offset", offset.toString());
          
          const leaderboardUrl = `${RECALL_API_URL}/api/competitions/leaderboard${params.toString() ? `?${params.toString()}` : ""}`;
          const leaderboardResponse = await axios.get(leaderboardUrl, { headers });
          return leaderboardResponse.data;

        case "get-status":
          const statusResponse = await axios.get(`${RECALL_API_URL}/api/competitions/status`, { headers });
          return statusResponse.data;

        case "get-rules":
          const rulesResponse = await axios.get(`${RECALL_API_URL}/api/competitions/rules`, { headers });
          return rulesResponse.data;

        case "get-upcoming":
          const upcomingResponse = await axios.get(`${RECALL_API_URL}/api/competitions/upcoming`, { headers });
          return upcomingResponse.data;

        case "get-competition":
          if (!competitionId) {
            throw new Error("Competition ID is required for get-competition operation");
          }
          const competitionResponse = await axios.get(`${RECALL_API_URL}/api/competitions/${competitionId}`, { headers });
          return competitionResponse.data;

        case "get-competition-agents":
          if (!competitionId) {
            throw new Error("Competition ID is required for get-competition-agents operation");
          }
          const competitionAgentsResponse = await axios.get(`${RECALL_API_URL}/api/competitions/${competitionId}/agents`, { headers });
          return competitionAgentsResponse.data;

        case "join-competition":
          if (!competitionId || !agentId) {
            throw new Error("Competition ID and Agent ID are required for join-competition operation");
          }
          const joinResponse = await axios.post(`${RECALL_API_URL}/api/competitions/${competitionId}/agents/${agentId}`, {}, { headers });
          return joinResponse.data;

        case "leave-competition":
          if (!competitionId || !agentId) {
            throw new Error("Competition ID and Agent ID are required for leave-competition operation");
          }
          const leaveResponse = await axios.delete(`${RECALL_API_URL}/api/competitions/${competitionId}/agents/${agentId}`, { headers });
          return leaveResponse.data;

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