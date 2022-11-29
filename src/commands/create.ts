import { IActionHandler, TaskPriority, TaskStatus } from "types";
import { ActionHandler, Command, StringType } from "cliffy/command/mod.ts";
import { colors } from "cliffy/ansi/colors.ts";
import { DB } from "sql";
import { logInternalError, priorityCheck, statusCheck } from "utils";

const action: ActionHandler<IActionHandler, [StringType & string]> = (
  { status, priority },
  message,
) => {
  if (status && !statusCheck(status)) return;
  if (priority && !priorityCheck(priority)) return;

  const db = new DB("src/db/main.db");
  try {
    db.query("INSERT INTO tasks (title, status, priority) VALUES (?, ?, ?)", [
      message,
      status || TaskStatus.TODO,
      priority || TaskPriority.NORMAL,
    ]);
  } catch (_) {
    logInternalError();
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
