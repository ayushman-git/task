import { TaskStatus } from "../types/index.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import {
  ActionHandler,
  Command,
} from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v0.25.4/ansi/colors.ts";

const action: ActionHandler = ({ status }, message: string) => {
  const db = new DB("src/db/main.db");
  if (!statusCheck(status)) {
    console.log(
      "❌",
      colors.red("Accpected status values are"),
      colors.red.bold("todo, doing and done."),
    );
    return;
  }

  db.query("INSERT INTO tasks (title, status) VALUES (?, ?)", [
    message,
    status,
  ]);

  db.close();
  console.log(colors.green("Task created successfully ✔"));
};

const statusCheck = (status: string) => {
  return Object.values(TaskStatus).includes(status as TaskStatus);
};

export const create = new Command()
  .arguments("<message:string>")
  .complete(
    "status",
    () => [TaskStatus.TODO, TaskStatus.DOING, TaskStatus.DOING],
  )
  .option("-s, --status <status:string:status>", "Define status of task.")
  .description("Create a new task")
  .action(action);
