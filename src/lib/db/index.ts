import { DatabaseAdapter } from "./types";
import { JsonAdapter } from "./adapters/json";
import { DynamoDBAdapter } from "./adapters/dynamodb";
import { SqlAdapter } from "./adapters/sql";
import { env } from "@/env";

// Factory to create the appropriate adapter based on env vars
export function getDB(): DatabaseAdapter {
  const adapterType = env.DB_ADAPTER;

  switch (adapterType) {
    case "dynamodb":
      return new DynamoDBAdapter();
    case "sql":
      return new SqlAdapter();
    case "json":
    default:
      return new JsonAdapter();
  }
}

export const db = getDB();
