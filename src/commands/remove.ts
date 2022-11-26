import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const deleteTask = (tid: number) => {
  const db = new DB("src/db/main.db");
  db.query(`DELETE FROM tasks
  WHERE id = ${tid}`);
  db.close();
};

const action = (_, tid: number) => {
  deleteTask(tid);
};

export const remove = new Command()
  .alias("rm")
  .arguments("<tid:number>")
  .description("Removes task(s)")
  .action(action);
