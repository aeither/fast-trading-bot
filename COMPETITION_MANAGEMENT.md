# Competition Management Tool

This document describes the new competition management tool that has been added to the fast-trading-bot project using Mastra MCP.

## Overview

The competition management tool provides a comprehensive interface for managing competition information, leaderboards, status, rules, and competition agent operations. It implements all the endpoints specified in the competition management API.

## Features

### 1. Competition Information
- **Get Competitions**: Retrieve all available competitions
- **Get Competition**: Get details about a specific competition by ID
- **Get Upcoming**: View upcoming competitions

### 2. Competition Status & Rules
- **Get Status**: Check the current status of competitions
- **Get Rules**: Retrieve competition rules and guidelines

### 3. Leaderboard Management
- **Get Leaderboard**: View competition leaderboards with rankings, scores, and performance metrics
- Supports pagination with limit and offset parameters

### 4. Competition Agent Management
- **Get Competition Agents**: View agents participating in a specific competition
- **Join Competition**: Add an agent to a competition
- **Leave Competition**: Remove an agent from a competition

## Usage

### Environment Variables

The tool uses the existing environment variables that are already configured for the Recall API:

```bash
RECALL_API_URL=https://your-recall-api-endpoint.com
RECALL_API_KEY=your-recall-api-key
```

### Using the Competition Manager

The competition manager is available as a Mastra agent that can be invoked to perform competition management operations:

```typescript
// The competition manager is automatically available in your Mastra instance
const agent = mastra.getAgent("competitionManager");

// Example: Get all competitions
const response = await agent.stream([
  { role: "user", content: "Show me all available competitions" }
]);
```

### Direct Tool Usage

You can also use the tool directly in your code:

```typescript
import { competitionManagement } from "./src/mastra/tools/competition-management";

// Get all competitions
const competitions = await competitionManagement.execute({ action: "get-competitions" });

// Get competition status
const status = await competitionManagement.execute({ action: "get-status" });

// Get competition rules
const rules = await competitionManagement.execute({ action: "get-rules" });

// Get upcoming competitions
const upcoming = await competitionManagement.execute({ action: "get-upcoming" });

// Get leaderboard with pagination
const leaderboard = await competitionManagement.execute({ 
  action: "get-leaderboard", 
  limit: 20, 
  offset: 0 
});

// Get specific competition details
const competition = await competitionManagement.execute({
  action: "get-competition",
  competitionId: "comp-123"
});

// Get agents in a specific competition
const agents = await competitionManagement.execute({
  action: "get-competition-agents",
  competitionId: "comp-123"
});

// Join a competition
const joinResult = await competitionManagement.execute({
  action: "join-competition",
  competitionId: "comp-123",
  agentId: "agent-456"
});

// Leave a competition
const leaveResult = await competitionManagement.execute({
  action: "leave-competition",
  competitionId: "comp-123",
  agentId: "agent-456"
});
```

## API Endpoints

The tool implements the following API endpoints:

- `GET /api/competitions` - Get all competitions
- `GET /api/competitions/leaderboard` - Get competition leaderboard
- `GET /api/competitions/status` - Get competition status
- `GET /api/competitions/rules` - Get competition rules
- `GET /api/competitions/upcoming` - Get upcoming competitions
- `GET /api/competitions/{competitionId}` - Get specific competition
- `GET /api/competitions/{competitionId}/agents` - Get agents in competition
- `POST /api/competitions/{competitionId}/agents/{agentId}` - Join competition
- `DELETE /api/competitions/{competitionId}/agents/{agentId}` - Leave competition

## Data Schemas

### Competition Schema
```typescript
{
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  rules?: string;
}
```

### Leaderboard Entry Schema
```typescript
{
  rank: number;
  agentId: string;
  agentName: string;
  score: number;
  pnl?: number;
  trades?: number;
}
```

### Competition Agent Schema
```typescript
{
  id: string;
  name: string;
  description?: string;
  status: string;
  score?: number;
  pnl?: number;
  trades?: number;
}
```

## Error Handling

The tool includes comprehensive error handling:

- Validates required environment variables
- Handles API request failures with descriptive error messages
- Validates required parameters (competitionId, agentId) for specific operations
- Provides clear error messages for missing or invalid data

## Integration with Mastra

The competition management tool is fully integrated with the Mastra framework:

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

## Next Steps

To use this tool effectively:

1. Ensure your Recall API credentials are properly configured
2. Test the tool with your competition management API
3. Integrate it into your trading workflows as needed
4. Use the competition manager agent for natural language interactions

The tool is designed to be flexible and can be easily extended with additional functionality as your competition management needs evolve. 