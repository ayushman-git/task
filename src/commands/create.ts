import { TaskPriority, TaskStatus } from "../types/index.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import {
  ActionHandler,
  Command,
} from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v0.25.4/ansi/colors.ts";

const action: ActionHandler = ({ status, priority }, message: string) => {
  const db = new DB("src/db/main.db");
  if (status && !statusCheck(status)) return;

  db.query("INSERT INTO tasks (title, status, priority) VALUES (?, ?, ?)", [
    message,
    status || TaskStatus.TODO,
    priority || TaskPriority.NORMAL,
  ]);

  db.close();
  console.log(colors.green("✔ Task successfully created! "));
};

const statusCheck = (status: string) => {
  const isCorrect = Object.values(TaskStatus).includes(status as TaskStatus);
  if (!isCorrect) {
    console.log(
      "❌",
      colors.red("Accepted status values are"),
      colors.red.bold(
        `${TaskStatus.TODO}, ${TaskStatus.DOING} and ${TaskStatus.DOING}.`,
      ),
    );
  }
  return isCorrect;
};

export const create = new Command()
  .arguments("<message:string>")
  .complete(
    "status",
    () => [TaskStatus.TODO, TaskStatus.DOING, TaskStatus.DOING],
  )
  .complete(
    "priority",
    () => [TaskPriority.LOW, TaskPriority.NORMAL, TaskPriority.HIGH],
  )
  .option("-s, --status <status:string:status>", "Define status of task.")
  .option(
    "-p, --priority <priority:string:priority>",
    "Define priority of task.",
  )
  .description("Create a new task")
  .action(action);
