import { setupCommands } from "./commands/index.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { TaskPriority, TaskStatus } from "./types/index.ts";

setupCommands();

// Open a database
const db = new DB("src/db/main.db");
db.execute(`
  CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    status TEXT CHECK( pType IN ('${TaskStatus.TODO}','${TaskStatus.DOING}','${TaskStatus.DONE}') ) NOT NULL DEFAULT '${TaskStatus.TODO}',
    priority TEXT CHECK( pType IN ('${TaskPriority.LOW}','${TaskPriority.NORMAL}','${TaskPriority.HIGH}') ) NOT NULL DEFAULT '${TaskPriority.NORMAL}',
  )
`);

// Run a simple query
for (const name of ["Peter Parker", "Clark Kent", "Bruce Wayne"]) {
  db.query("INSERT INTO people (name) VALUES (?)", [name]);
}

// Print out data in table
for (const [name] of db.query("SELECT name FROM people")) {
  console.log(name);
}

// Close connection
db.close();
