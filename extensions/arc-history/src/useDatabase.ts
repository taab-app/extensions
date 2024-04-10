import { Database } from "bun:sqlite";
import path from "node:path";
import os from "node:os";
import hash from "object-hash";
import { copyFile, mkdir } from "node:fs/promises";

import { getHistoryQuery, historyDatabasePath } from "./sql";
import { useCallback } from "react";

export const useDatabase = () => {
  const createDatabase = useCallback(async () => {
    const tempFolder = path.join(
      os.tmpdir(),
      "useSQL",
      hash(historyDatabasePath)
    );

    await mkdir(tempFolder, { recursive: true });
    const dbPath = path.join(tempFolder, "db.db");
    await copyFile(historyDatabasePath, dbPath);
    const db = new Database(dbPath);

    return db;
  }, []);

  const queryDb = useCallback((db: Database, q: string) => {
    const textQuery = getHistoryQuery(q, 5);
    const sqlQuery = db.query(textQuery);
    const result = sqlQuery.all();
    return result;
  }, []);

  return {
    createDatabase,
    queryDb,
  };
};
