import { TaskPriority, TaskStatus } from "../types/index.ts";
import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";
import {
  ActionHandler,
  Command,
  StringType,
} from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v0.25.4/ansi/colors.ts";
import { priorityCheck, statusCheck } from "../utils/checks.ts";
import { IActionHandler } from "./type.ts";

const action: ActionHandler<IActionHandler, [StringType & string]> = (
  { status, priority },
  message: string,
) => {
  const db = new DB("src/db/main.db");
  if (status && !statusCheck(status)) return;
  if (priority && !priorityCheck(priority)) return;

  try {
    db.query("INSERT INTO tasks (title, status, priority) VALUES (?, ?, ?)", [
      message,
      status || TaskStatus.TODO,
      priority || TaskPriority.NORMAL,
    ]);
  } catch (_) {
    console.log(colors.red.bold("Some internal error has occured!"));
  } finally {
    db.close();
  }

  console.log(colors.green("✔ Task successfully created! "));
};

export const create = new Command()
  .description("Create a new task")
  .arguments("<message:string>")
  // Status flag
  .complete(
    "status",
    () => Object.values(TaskStatus),
  )
  .option("-s, --status <status:string:status>", "Define status of task.")
  // Priority flag
  .complete(
    "priority",
    () => Object.values(TaskPriority),
  )
  .option(
    "-p, --priority <priority:string:priority>",
    "Define priority of task.",
  )
  .action(action);
