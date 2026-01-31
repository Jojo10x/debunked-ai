import { pgTable, uuid, text, timestamp, jsonb, index, doublePrecision } from "drizzle-orm/pg-core";

export const datasetSamples = pgTable("dataset_samples", {
  id: uuid("id").defaultRandom().primaryKey(),
  externalId: text("external_id"),
  text: text("text").notNull(),
  imageUrl: text("image_url"),
  source: text("source"),
  label: text("label").notNull(), 
  metadata: jsonb("metadata"), 
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    labelIdx: index("label_idx").on(table.label),
  };
});

export const analyses = pgTable("analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"), 
  inputType: text("input_type").notNull(), 
  textContent: text("text_content"),
  imageUrl: text("image_url"),
  
  status: text("status").default("pending"), 
  prediction: text("prediction"), 
  
  confidenceScore: doublePrecision("confidence_score"), 
  
  resultDetails: jsonb("result_details"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const explanations = pgTable("explanations", {
  id: uuid("id").defaultRandom().primaryKey(),
  analysisId: uuid("analysis_id").references(() => analyses.id),
  
  type: text("type").notNull(), 
  data: jsonb("data").notNull(), 
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const scans = pgTable("scans", {
  id: uuid("id").defaultRandom().primaryKey(),
  text: text("text").notNull(),
  label: text("label").notNull(), 
  confidence: doublePrecision("confidence").notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
});