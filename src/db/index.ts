import { DB } from "sql";
import { TaskPriority, TaskStatus } from "types";

export const initializeDb = () => {
  const db = new DB("src/db/main.db");
  try {
    db.execute(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          status TEXT CHECK( status IN ('${TaskStatus.TODO}','${TaskStatus.DOING}','${TaskStatus.DONE}') ) NOT NULL DEFAULT '${TaskStatus.TODO}',
          priority TEXT CHECK( priority IN ('${TaskPriority.LOW}','${TaskPriority.NORMAL}','${TaskPriority.HIGH}') ) NOT NULL DEFAULT '${TaskPriority.NORMAL}',
          created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
          due_at TEXT
        )
      `);
  } catch (err) {
    console.log(err);
  } finally {
    db.close();
  }
};
