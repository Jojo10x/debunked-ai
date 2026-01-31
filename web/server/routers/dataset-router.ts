import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "../../src/db";
import { datasetSamples } from "../../src/db/schema";
import { desc } from "drizzle-orm";

export const datasetRouter = router({
  getRecent: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(10) }))
    .query(async ({ input }) => {
      const samples = await db
        .select()
        .from(datasetSamples)
        .orderBy(desc(datasetSamples.createdAt))
        .limit(input.limit);

      return samples;
    }),
});