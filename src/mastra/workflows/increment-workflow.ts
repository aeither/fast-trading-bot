import { z } from "zod";
import { inngest } from "../inngest";
import { init } from "@mastra/inngest";

const { createWorkflow, createStep } = init(inngest);

const incrementStep = createStep({
  id: "increment",
  inputSchema: z.object({
    value: z.number(),
  }),
  outputSchema: z.object({
    value: z.number(),
  }),
  execute: async ({ inputData }) => {
    return { value: inputData.value + 1 };
  },
});

const workflow = createWorkflow({
  id: "increment-workflow",
  inputSchema: z.object({
    value: z.number(),
  }),
  outputSchema: z.object({
    value: z.number(),
  }),
}).then(incrementStep);

workflow.commit();

export { workflow as incrementWorkflow }; 