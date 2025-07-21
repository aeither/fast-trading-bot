import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
 
import { tradingAgent } from "./agents/trading-agent";
import { agentManager } from "./agents/agent-manager";
import { competitionManager } from "./agents/competition-manager";
import { priceManager } from "./agents/price-manager";
import { recallWorkflow } from "./workflows/recall-workflow";

export const mastra = new Mastra({
  workflows: { recallWorkflow },
  agents: { tradingAgent, agentManager, competitionManager, priceManager },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});