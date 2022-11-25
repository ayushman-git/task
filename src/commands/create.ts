import { DB } from "https://deno.land/x/sqlite/mod.ts";
import {
  ActionHandler,
  Command,
} from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";

const action: ActionHandler = (_, message: string) => {
  const db = new DB("src/db/main.db");

  db.query("INSERT INTO tasks (title) VALUES (?)", [message]);
  db.close();
};

export const create = new Command()
  .arguments("<message:string>")
  .description("Create a new task")
  .action(action);
