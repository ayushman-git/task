import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { generateTable } from "../utils/tables.ts";

const getTasks = () => {
  const db = new DB("src/db/main.db");

  const tasks = db.query("SELECT * from tasks");
  db.close();
  return tasks;
};

const action = () => {
  const headers = ["ID", "Title", "Status", "Priority", "Created", "Due"];
  const body = getTasks();

  generateTable(headers, body);
};

export const tasks = new Command()
  .description("Display all the existings tasks")
  .action(action);
