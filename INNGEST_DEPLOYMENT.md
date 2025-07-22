# Inngest Integration & Deployment Guide

This guide walks you through integrating Inngest with your fast-trading-bot for autonomous trading operations.

## Overview

Inngest provides a serverless platform for running background workflows without managing infrastructure. Our autonomous trading workflow will:

1. **Analyze market conditions** using AI agents
2. **Execute trades** based on analysis
3. **Record results** and continue monitoring
4. **Run continuously** with proper intervals

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running
- [Vercel CLI](https://vercel.com/docs/cli) installed (`npm i -g vercel`)
- [Inngest account](https://www.inngest.com/) (free tier available)
- Environment variables configured

## Local Testing

### Step 1: Start Mastra Server

```bash
# Start the Mastra development server
npx mastra dev
```

The server will start on `http://localhost:4111` with the Inngest endpoint at `/api/inngest`.

### Step 2: Start Inngest Dev Server

In a new terminal, run:

```bash
docker run --rm -p 8288:8288 \
  inngest/inngest \
  inngest dev -u http://host.docker.internal:4111/api/inngest
```

### Step 3: Access Inngest Dashboard

1. Open [http://localhost:8288](http://localhost:8288) in your browser
2. Go to the **Apps** section in the sidebar
3. You should see your "fast-trading-bot" app registered

### Step 4: Test the Workflow

1. Go to the **Functions** section
2. Select `workflow.autonomous-trading`
3. Click **Invoke** and use this test input:

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

### Step 5: Monitor Execution

1. Go to the **Runs** tab
2. Click on the latest run to see step-by-step execution
3. Monitor the workflow progress in real-time

## Production Deployment

### Step 1: Configure Environment Variables

Create a `.env` file with your production credentials:

```bash
# Recall API Configuration
RECALL_API_URL=https://your-recall-api-endpoint.com
RECALL_API_KEY=your-recall-api-key

# Vercel Deployment
VERCEL_TOKEN=your_vercel_token
VERCEL_TEAM_SLUG=your_team_slug
VERCEL_PROJECT_NAME=fast-trading-bot

# Inngest Configuration
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

### Step 2: Build the Application

```bash
npx mastra build
```

This creates a production-ready build in `.mastra/output/`.

### Step 3: Deploy to Vercel

```bash
cd .mastra/output
vercel --prod
```

If you haven't logged in to Vercel CLI:
```bash
vercel login
```

### Step 4: Sync with Inngest Dashboard

1. Go to the [Inngest dashboard](https://app.inngest.com/env/production/apps)
2. Click **Sync new app with Vercel**
3. Follow the instructions to connect your Vercel project
4. You should see your "fast-trading-bot" app registered

### Step 5: Test Production Workflow

1. In the **Functions** section, select `workflow.autonomous-trading`
2. Click **All actions** (top right) > **Invoke**
3. Provide the same test input as local testing
4. Monitor execution in the **Runs** tab

## Workflow Architecture

### Autonomous Trading Workflow

The workflow consists of three main steps:

1. **Market Analysis** (`analyze-market`)
   - Analyzes market conditions using AI agents
   - Identifies trading opportunities
   - Returns confidence scores and recommendations

2. **Trade Execution** (`execute-trade`)
   - Executes trades based on analysis
   - Uses the trading agent for actual trade execution
   - Records trade details and status

3. **Results Recording** (`record-results`)
   - Records final execution results
   - Provides summary statistics
   - Marks workflow as completed

### Continuous Operation

For continuous autonomous operation, you can:

1. **Schedule regular invocations** using Inngest's scheduling features
2. **Trigger on events** (price alerts, market conditions)
3. **Chain workflows** for complex trading strategies

## Monitoring & Observability

### Inngest Dashboard Features

- **Real-time execution monitoring**
- **Step-by-step progress tracking**
- **Error handling and retries**
- **Execution history and logs**
- **Performance metrics**

### Logging

The workflow includes comprehensive logging:

```typescript
// Each step logs its progress
console.log(`Analyzing market for pairs: ${tradingPairs.join(", ")}`);
console.log(`Executed ${executedTrades.length} trades`);
console.log(`Workflow completed with status: ${finalStatus}`);
```

### Error Handling

The workflow includes robust error handling:

- **API failures** are caught and logged
- **Invalid data** is validated with Zod schemas
- **Agent errors** are handled gracefully
- **Retry logic** for transient failures

## Customization

### Adding New Trading Pairs

Update the workflow input:

```typescript
const autonomousTradingWorkflow = createWorkflow({
  id: "autonomous-trading",
  inputSchema: z.object({
    tradingPairs: z.array(z.string()),
    maxTradesPerCycle: z.number().default(10),
    // Add new parameters as needed
    riskLevel: z.number().default(0.5),
    tradingStrategy: z.string().default("conservative"),
  }),
  // ...
});
```

### Modifying Trading Logic

Update the execute functions in each step:

```typescript
execute: async ({ inputData, mastra }) => {
  // Add your custom trading logic here
  const agent = mastra?.getAgent("tradingAgent");
  
  // Custom analysis or execution logic
  // ...
}
```

### Adding New Steps

Create new steps and chain them:

```typescript
const customStep = createStep({
  id: "custom-step",
  inputSchema: z.object({ /* your schema */ }),
  outputSchema: z.object({ /* your schema */ }),
  execute: async ({ inputData, mastra }) => {
    // Your custom logic
    return { /* your output */ };
  },
});

workflow
  .then(analyzeMarketStep)
  .then(customStep) // Add your step
  .then(executeTradeStep)
  .then(recordResultsStep);
```

## Troubleshooting

### Common Issues

1. **Workflow not appearing in Inngest**
   - Check that the Mastra server is running
   - Verify the `/api/inngest` endpoint is accessible
   - Check Inngest dev server logs

2. **Agent not found errors**
   - Ensure all agents are properly registered in `src/mastra/index.ts`
   - Check agent import paths

3. **API authentication errors**
   - Verify `RECALL_API_URL` and `RECALL_API_KEY` are set
   - Check API endpoint accessibility

4. **Deployment failures**
   - Verify Vercel token is valid
   - Check build output for errors
   - Ensure all dependencies are installed

### Debug Mode

Enable debug logging:

```typescript
logger: new PinoLogger({
  name: "Mastra",
  level: "debug", // Change from "info" to "debug"
}),
```

## Next Steps

1. **Set up monitoring alerts** for workflow failures
2. **Implement more sophisticated trading strategies**
3. **Add risk management rules**
4. **Integrate with additional data sources**
5. **Set up automated testing for workflows**

## Support

- [Inngest Documentation](https://www.inngest.com/docs)
- [Mastra Documentation](https://docs.mastra.ai)
- [Vercel Documentation](https://vercel.com/docs) 