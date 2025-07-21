import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
 
import { recallAgent } from "./agents/recall-agent";
import { recallWorkflow } from "./workflows/recall-workflow";
 
export const mastra = new Mastra({
  workflows: { recallWorkflow },
  agents: { recallAgent },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});