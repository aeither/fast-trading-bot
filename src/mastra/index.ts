import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { serve as inngestServe } from "@mastra/inngest";
import { VercelDeployer } from "@mastra/deployer-vercel";

import { tradingAgent } from "./agents/trading-agent";
import { agentManager } from "./agents/agent-manager";
import { competitionManager } from "./agents/competition-manager";
import { priceManager } from "./agents/price-manager";
import { recallWorkflow } from "./workflows/recall-workflow";
import { autonomousTradingWorkflow } from "./workflows/autonomous-trading";
import { incrementWorkflow } from "./workflows/increment-workflow";
import { inngest } from "./inngest";

export const mastra = new Mastra({
  workflows: { recallWorkflow, autonomousTradingWorkflow, incrementWorkflow },
  agents: { tradingAgent, agentManager, competitionManager, priceManager },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  server: {
    host: "0.0.0.0",
    apiRoutes: [
      {
        path: "/api/inngest",
        method: "ALL",
        createHandler: async ({ mastra }) => inngestServe({ mastra, inngest }),
      },
    ],
  },
  deployer: new VercelDeployer(),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});