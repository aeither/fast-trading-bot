import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
 
import { recallAgent } from "./agents/recall-agent";
import { agentManager } from "./agents/agent-manager";
import { competitionManager } from "./agents/competition-manager";
import { priceManager } from "./agents/price-manager";
import { recallWorkflow } from "./workflows/recall-workflow";

export const mastra = new Mastra({
  workflows: { recallWorkflow },
  agents: { recallAgent, agentManager, competitionManager, priceManager },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});