import { Database } from "bun:sqlite";
import path from "node:path";
import os from "node:os";
import hash from "object-hash";
import { copyFile, mkdir } from "node:fs/promises";

import { useCallback } from "react";

export const useDatabase = () => {
  const createDatabase = useCallback(async (vscodeDbPath: string) => {
    const tempFolder = path.join(os.tmpdir(), "useSQL", hash(vscodeDbPath));

    await mkdir(tempFolder, { recursive: true });

    const dbPath = path.join(tempFolder, "db.db");
    await copyFile(vscodeDbPath, dbPath);
    const db = new Database(dbPath);

    return db;
  }, []);

  const queryDb = useCallback(async (db: Database, q: string) => {
    if (!db) return [];
    const sqlQuery =
      db.query(`SELECT * FROM 'ItemTable' where key = 'history.entries' LIMIT 0,30
    `);
    const result = sqlQuery.all();
    sqlQuery.finalize();
    return result;
  }, []);

  return {
    createDatabase,
    queryDb,
  };
};
