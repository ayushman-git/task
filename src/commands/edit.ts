import { colors } from "cliffy/ansi/colors.ts";
import { ActionHandler, Command, NumberType, StringType } from "cliffy/command/mod.ts";
import { DB } from "sql";
import { IActionHandler, TaskPriority, TaskStatus } from "types";
import { logInternalError } from "utils";

interface IActionHandlerExt extends IActionHandler {
  title?: (StringType & string) | undefined;
}

const generateQuery = ({ title, status, priority }: any, tid: number) => {
  const queriesArr: string[] = [];

  if (title) {
    queriesArr.push(`title = '${title}'`);
  }
  if (status) {
    queriesArr.push(`status = '${status}'`);
  }
  if (priority) {
    queriesArr.push(`priority = '${priority}'`);
  }
  const setQuery = queriesArr.reduce((acc, current, currentIndex) => {
    return `${acc} ${current}${
      currentIndex === queriesArr.length - 1 ? "" : ","
    }`;
  }, "");
  return setQuery ? `UPDATE tasks SET ${setQuery} WHERE id = ${tid}` : "";
};

const action: ActionHandler<IActionHandlerExt, [NumberType & number]> = (
  { title, status, priority },
  tid,
) => {
  const db = new DB("src/db/main.db");

  try {
    const queryStr = generateQuery({ title, status, priority }, tid);
    console.log(queryStr);
    if (queryStr) {
      db.query(queryStr);
    } else {
      console.log(colors.red("At least one flag is needed to edit!"));
      return;
    }
  } catch (_) {
    logInternalError();
  } finally {
    db.close();
  }

  console.log(
    colors.green("✔ Task ID"),
    colors.green.bold(tid.toString()),
    colors.green("successfully edited!"),
  );
};

export const edit = new Command()
  .description("Edit a task")
  .alias("ed")
  .arguments("<tid:number>")
  // Title flag
  .option(
    "-t, --title <title:string:title>",
    "Replaces the title.",
  )
  // Status flag
  .complete(
    "status",
    () => Object.values(TaskStatus),
  )
  .option(
    "-s, --status <status:string:status>",
    "Replaces the status.",
  )
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
