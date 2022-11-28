import { colors } from "https://deno.land/x/cliffy@v0.25.4/ansi/colors.ts";
import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { DB, Row } from "https://deno.land/x/sqlite/mod.ts";
import { TaskPriority, TaskStatus } from "../types/index.ts";
import { priorityCheck, statusCheck } from "../utils/checks.ts";
import { convertToReadableDueAndCreated } from "../utils/datetime.ts";
import { generateTable } from "../utils/tables.ts";

const selectiveQuery = ({ status, priority }: any) => {
  const queriesArr: string[] = [];

  if (status) {
    queriesArr.push(`status = '${status}'`);
  }
  if (priority) {
    queriesArr.push(`priority = '${priority}'`);
  }
  const setQuery = queriesArr.reduce((acc, current, currentIndex) => {
    return `${acc} ${current}${
      currentIndex === queriesArr.length - 1 ? "" : " AND"
    }`;
  }, "");

  return setQuery ? `WHERE ${setQuery}` : "";
};

const getTasks = ({ status, priority }: any) => {
  const db = new DB("src/db/main.db");

  const tasks = db.query(
    `SELECT * from tasks ${
      selectiveQuery({ status, priority })
    } ORDER BY created_at DESC`,
  );
  db.close();

  return tasks;
};

const covertDatetime = (data: Row[]): any[] => {
  return data.map((value) => {
    const newRow = value;

    // [4] Created At
    newRow[4] = convertToReadableDueAndCreated(new Date(newRow[4] as string));
    // [5] Due
    newRow[5] = newRow[5] &&
      convertToReadableDueAndCreated(new Date(newRow[5] as string));
    return newRow;
  });
};

const action = ({ priority, status }: any) => {
  if (status && !statusCheck(status)) return;
  if (priority && !priorityCheck(priority)) return;

  const headers = ["ID", "Title", "Status", "Priority", "Created", "Due"];
  const body = getTasks({ priority, status });
  if (!body.length) {
    console.log(colors.red("❌ No tasks found!"));
    return;
  }
  generateTable(headers, covertDatetime(body));
};

export const tasks = new Command()
  .complete(
    "priority",
    () => Object.values(TaskPriority),
  )
  .option(
    "-p, --priority <priority:string:priority>",
    "Displays tasks based on priority.",
  )
  .complete(
    "status",
    () => Object.values(TaskStatus),
  )
  .option(
    "-s, --status <status:string:status>",
    "Displays tasks based on status.",
  )
  .description("Display all the existings tasks")
  .action(action);
