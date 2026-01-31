import { datasetRouter } from "./routers/dataset-router";
import { router } from "./trpc";

export const appRouter = router({
  dataset: datasetRouter, 
});

export type AppRouter = typeof appRouter;