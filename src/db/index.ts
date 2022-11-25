import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { TaskPriority, TaskStatus } from "../types/index.ts";

export const initializeDb = () => {
  const db = new DB("src/db/main.db");
  db.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        status TEXT CHECK( status IN ('${TaskStatus.TODO}','${TaskStatus.DOING}','${TaskStatus.DONE}') ) NOT NULL DEFAULT '${TaskStatus.TODO}',
        priority TEXT CHECK( priority IN ('${TaskPriority.LOW}','${TaskPriority.NORMAL}','${TaskPriority.HIGH}') ) NOT NULL DEFAULT '${TaskPriority.NORMAL}',
        created_at TEXT NOT NULL DEFAULT current_timestamp,
        due_at TEXT
      )
    `);

  // Close connection
  db.close();
};
