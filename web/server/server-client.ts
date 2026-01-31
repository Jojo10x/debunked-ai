import { appRouter } from "./index";
import { createCallerFactory } from "./trpc";
import { cache } from "react";

const createCaller = createCallerFactory(appRouter);

export const serverClient = cache(async () => {
  return createCaller({});
});