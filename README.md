# Fast Trading Bot

A high-performance autonomous trading bot built with Mastra framework, designed for fast and efficient automated trading operations with AI-powered decision making and background workflow execution.

## Features

- **AI-Powered Trading**: Leverages Groq AI for intelligent trading decisions
- **Autonomous Operation**: Background workflows with Inngest for continuous trading
- **Comprehensive Agent Management**: Profile, balance, portfolio, and trade management
- **Competition Management**: Leaderboards, rules, and agent participation tracking
- **Real-time Price Data**: Token price information and market data
- **Memory Management**: Persistent memory for trading strategies and historical data
- **Logging & Monitoring**: Comprehensive logging for debugging and performance tracking
- **TypeScript Support**: Full TypeScript implementation for type safety
- **Serverless Deployment**: Ready for production deployment on Vercel

## Prerequisites

- Node.js >= 20.9.0
- npm or yarn package manager
- Docker (for local Inngest testing)
- Vercel CLI (for production deployment)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fast-trading-bot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your credentials
RECALL_API_URL=https://your-recall-api-endpoint.com
RECALL_API_KEY=your-recall-api-key
```

## Development

Start the development server:
```bash
npm run dev
```

The server will be available at:
- **API**: http://localhost:4111/api
- **Playground**: http://localhost:4111
- **OpenAPI Docs**: http://localhost:4111/openapi.json
- **Swagger UI**: http://localhost:4111/swagger-ui

## Building

Build the project for production:
```bash
npm run build
```

## Running

Start the production server:
```bash
npm start
```

## Project Structure

```
fast-trading-bot/
├── src/
│   └── mastra/
│       ├── agents/           # AI trading agents
│       │   ├── trading-agent.ts      # Main trading agent
│       │   ├── agent-manager.ts      # Agent management
│       │   ├── competition-manager.ts # Competition management
│       │   └── price-manager.ts      # Price information
│       ├── tools/            # Trading tools and utilities
│       │   ├── trade-execution.ts    # Trade execution
│       │   ├── agent-management.ts   # Agent API tools
│       │   ├── competition-management.ts # Competition API tools
│       │   └── price-management.ts   # Price API tools
│       ├── workflows/        # Trading workflows
│       │   ├── recall-workflow.ts    # Basic trading workflow
│       │   ├── autonomous-trading.ts # Autonomous trading workflow
│       │   └── increment-workflow.ts # Test workflow
│       ├── inngest/          # Inngest configuration
│       │   └── index.ts      # Inngest setup
│       └── index.ts          # Main entry point
├── package.json
├── tsconfig.json
├── INNGEST_DEPLOYMENT.md     # Inngest deployment guide
├── AGENT_MANAGEMENT.md       # Agent management documentation
├── COMPETITION_MANAGEMENT.md # Competition management documentation
├── PRICE_MANAGEMENT.md       # Price management documentation
└── README.md
```

## Agents

### Trading Agent
- **Purpose**: Execute trades on the Recall Network
- **Capabilities**: 
  - Analyze market conditions
  - Execute spot trades with specified token pairs
  - Provide trading recommendations
- **Tools**: Trade execution

### Agent Manager
- **Purpose**: Manage agent profiles, balances, and portfolios
- **Capabilities**:
  - Get and update agent profiles
  - Check account balances across currencies
  - View portfolio holdings and performance
  - Retrieve trade history with pagination
  - Reset API keys
- **Tools**: Agent management API

### Competition Manager
- **Purpose**: Manage trading competitions and leaderboards
- **Capabilities**:
  - View all competitions and upcoming events
  - Check competition status and rules
  - View leaderboards with rankings
  - Join or leave competitions
  - Monitor agent participation
- **Tools**: Competition management API

### Price Manager
- **Purpose**: Fetch real-time token prices and market data
- **Capabilities**:
  - Get current prices for individual tokens
  - Batch price queries for multiple tokens
  - Retrieve token metadata and market statistics
  - Analyze price trends and market caps
- **Tools**: Price information API

## Tools

### Trade Execution
- **Endpoint**: `POST /api/trade/execute`
- **Functionality**: Execute spot trades on the Recall Network
- **Parameters**: `fromToken`, `toToken`, `amount`, `reason`

### Agent Management
- **Endpoints**: 
  - `GET /api/agent/profile` - Get agent profile
  - `PUT /api/agent/profile` - Update agent profile
  - `GET /api/agent/balances` - Get account balances
  - `GET /api/agent/portfolio` - Get portfolio holdings
  - `GET /api/agent/trades` - Get trade history
  - `POST /api/agent/reset-api-key` - Reset API key

### Competition Management
- **Endpoints**:
  - `GET /api/competitions` - List all competitions
  - `GET /api/competitions/leaderboard` - Get leaderboard
  - `GET /api/competitions/status` - Check competition status
  - `GET /api/competitions/rules` - Get competition rules
  - `GET /api/competitions/upcoming` - Get upcoming competitions
  - `GET /api/competitions/{id}` - Get specific competition
  - `GET /api/competitions/{id}/agents` - Get competition agents
  - `POST /api/competitions/{id}/agents/{agentId}` - Join competition
  - `DELETE /api/competitions/{id}/agents/{agentId}` - Leave competition

### Price Management
- **Endpoints**:
  - `GET /api/price` - Get token prices
  - `GET /api/price/token-info` - Get token information

## Workflows

### Recall Workflow
- **Purpose**: Basic trading workflow for single trade execution
- **Steps**: Market analysis → Trade execution

### Autonomous Trading Workflow
- **Purpose**: Continuous autonomous trading with AI analysis
- **Steps**: 
  1. Market analysis using AI agents
  2. Trade execution based on analysis
  3. Results recording and monitoring
- **Features**: Continuous operation, confidence scoring, error handling

### Increment Workflow
- **Purpose**: Simple test workflow for Inngest integration
- **Steps**: Increment input value by 1

## Inngest Integration

### Local Testing
```bash
# 1. Start Mastra server
npx mastra dev

# 2. Start Inngest dev server (in another terminal)
docker run --rm -p 8288:8288 \
  inngest/inngest \
  inngest dev -u http://host.docker.internal:4111/api/inngest

# 3. Open Inngest dashboard: http://localhost:8288
```

### Testing Workflows
Use these JSON payloads in the Inngest UI:

**Increment Workflow:**
```json
{
  "data": {
    "inputData": {
      "value": 5
    }
  }
}
```

**Autonomous Trading Workflow:**
```json
{
  "data": {
    "inputData": {
      "tradingPairs": ["USDC/WETH", "USDC/WBTC"],
      "maxTradesPerCycle": 5
    }
  }
}
```

### Production Deployment
```bash
# 1. Build the application
npx mastra build

# 2. Deploy to Vercel
cd .mastra/output
vercel --prod

# 3. Sync with Inngest dashboard
# 4. Test production workflows
```

## Dependencies

### Core Dependencies
- `@mastra/core`: Core Mastra framework
- `@mastra/libsql`: Database integration
- `@mastra/memory`: Memory management
- `@mastra/loggers`: Logging functionality
- `@mastra/inngest`: Inngest integration
- `@mastra/deployer-vercel`: Vercel deployment
- `@ai-sdk/groq`: AI integration for trading decisions
- `axios`: HTTP client for API calls
- `zod`: Schema validation
- `inngest`: Inngest workflow platform
- `@inngest/realtime`: Real-time Inngest features

### Development Dependencies
- `typescript`: TypeScript compiler
- `@types/node`: Node.js type definitions
- `mastra`: Mastra CLI tools

## Environment Variables

```bash
# Recall API Configuration
RECALL_API_URL=https://your-recall-api-endpoint.com
RECALL_API_KEY=your-recall-api-key

# Vercel Deployment (optional)
VERCEL_TOKEN=your_vercel_token
VERCEL_TEAM_SLUG=your_team_slug
VERCEL_PROJECT_NAME=fast-trading-bot

# Inngest Configuration (optional)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

## API Usage Examples

### Execute a Trade
```bash
curl -X POST http://localhost:4111/api/agents/tradingAgent/generate \
  -H "Content-Type: application/json" \
  -d '{"messages":["Execute a buy trade for 100 USDC worth of WETH"]}'
```

### Get Agent Balances
```bash
curl -X POST http://localhost:4111/api/agents/agentManager/generate \
  -H "Content-Type: application/json" \
  -d '{"messages":["Show me my current account balances"]}'
```

### Check Competition Leaderboard
```bash
curl -X POST http://localhost:4111/api/agents/competitionManager/generate \
  -H "Content-Type: application/json" \
  -d '{"messages":["Show me the current competition leaderboard"]}'
```

### Get Token Prices
```bash
curl -X POST http://localhost:4111/api/agents/priceManager/generate \
  -H "Content-Type: application/json" \
  -d '{"messages":["What is the current price of WETH and WBTC?"]}'
```

## Monitoring & Observability

- **Inngest Dashboard**: Real-time workflow monitoring and execution history
- **Mastra Playground**: Interactive testing interface
- **Comprehensive Logging**: Detailed logs for debugging and performance tracking
- **Error Handling**: Robust error handling with retry logic
- **Telemetry**: OpenTelemetry integration for production monitoring

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For support and questions, please open an issue in the repository.

## Documentation

- [Inngest Deployment Guide](INNGEST_DEPLOYMENT.md)
- [Agent Management Documentation](AGENT_MANAGEMENT.md)
- [Competition Management Documentation](COMPETITION_MANAGEMENT.md)
- [Price Management Documentation](PRICE_MANAGEMENT.md)
