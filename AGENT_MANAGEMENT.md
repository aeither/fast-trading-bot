# Agent Management Tool

This document describes the new agent management tool that has been added to the fast-trading-bot project using Mastra MCP.

## Overview

The agent management tool provides a comprehensive interface for managing agent profiles, balances, portfolio, trades, and API key operations. It implements all the endpoints specified in the agent management API.

## Features

### 1. Profile Management
- **Get Profile**: Retrieve current agent profile information
- **Update Profile**: Update agent profile details (name, description, avatar, etc.)

### 2. Balance Tracking
- **Get Balances**: Check agent account balances across different currencies
- Returns available, locked, and total balances for each currency

### 3. Portfolio Management
- **Get Portfolio**: View current portfolio holdings and performance
- Shows symbol, quantity, average price, current price, total value, and P&L

### 4. Trade History
- **Get Trades**: Retrieve trade history with optional pagination
- Supports limit and offset parameters for pagination

### 5. API Key Management
- **Reset API Key**: Generate a new API key for the agent

## Usage

### Environment Variables

The tool uses the existing environment variables that are already configured for the Recall API:

```bash
RECALL_API_URL=https://your-recall-api-endpoint.com
RECALL_API_KEY=your-recall-api-key
```

### Using the Agent Manager

The agent manager is available as a Mastra agent that can be invoked to perform agent management operations:

```typescript
// The agent manager is automatically available in your Mastra instance
const agent = mastra.getAgent("agentManager");

// Example: Get agent profile
const response = await agent.stream([
  { role: "user", content: "Get my agent profile" }
]);
```

### Direct Tool Usage

You can also use the tool directly in your code:

```typescript
import { agentManagement } from "./src/mastra/tools/agent-management";

// Get agent profile
const profile = await agentManagement.execute({ action: "get-profile" });

// Get balances
const balances = await agentManagement.execute({ action: "get-balances" });

// Get portfolio
const portfolio = await agentManagement.execute({ action: "get-portfolio" });

// Get recent trades (with pagination)
const trades = await agentManagement.execute({ 
  action: "get-trades", 
  limit: 10, 
  offset: 0 
});

// Update profile
const updatedProfile = await agentManagement.execute({
  action: "update-profile",
  profile: {
    name: "My Trading Agent",
    description: "A sophisticated trading agent",
    avatar: "https://example.com/avatar.png"
  }
});

// Reset API key
const newKey = await agentManagement.execute({ action: "reset-api-key" });
```

## API Endpoints

The tool implements the following API endpoints:

- `GET /api/agent/profile` - Get agent profile
- `PUT /api/agent/profile` - Update agent profile
- `GET /api/agent/balances` - Get agent balances
- `GET /api/agent/portfolio` - Get agent portfolio
- `GET /api/agent/trades` - Get agent trades
- `POST /api/agent/reset-api-key` - Reset API key

## Error Handling

The tool includes comprehensive error handling:

- Validates required environment variables
- Handles API request failures with descriptive error messages
- Validates input parameters before making requests
- Provides clear error messages for missing or invalid data

## Integration with Mastra

The agent management tool is fully integrated with the Mastra framework:

- Uses Mastra's tool creation utilities
- Follows Mastra's patterns for tool definition
- Integrates with Mastra's agent system
- Supports Mastra's workflow capabilities

## Next Steps

To use this tool effectively:

1. Set up the required environment variables
2. Configure your agent API endpoint
3. Test the tool with your agent management API
4. Integrate it into your trading workflows as needed

The tool is designed to be flexible and can be easily extended with additional functionality as your agent management needs evolve. 