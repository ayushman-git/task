import { colors } from "cliffy/ansi/colors.ts";
import { Command } from "cliffy/command/mod.ts";
import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";
import { TaskPriority, TaskStatus } from "types";

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

const action = ({ title, status, priority }: any, tid: number) => {
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
    console.log(colors.red.bold("Some internal error has occured!"));
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
  .alias("ed")
  .arguments("<tid:number>")
  .option(
    "-t, --title <title:string:title>",
    "Replaces the title.",
  )
  .complete(
    "status",
    () => Object.values(TaskStatus),
  )
  .complete(
    "priority",
    () => Object.values(TaskPriority),
  )
  .option(
    "-s, --status <status:string:status>",
    "Replaces the status.",
  )
  .option(
    "-p, --priority <priority:string:priority>",
    "Define priority of task.",
  )
  .description("Edit a task")
  .action(action);
