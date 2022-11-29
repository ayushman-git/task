import { colors } from "cliffy/ansi/colors.ts";
import { ActionHandler, Command } from "cliffy/command/mod.ts";
import { DB, Row } from "sql";
import { IActionHandler, TaskPriority, TaskStatus } from "types";
import {
  convertToReadableDueAndCreated,
  generateTable,
  priorityCheck,
  statusCheck,
  TASK_TABLE_HEADERS,
} from "utils";

const selectiveQuery = ({ status, priority }: IActionHandler) => {
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

const getTasks = ({ status, priority }: IActionHandler) => {
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

const action: ActionHandler<IActionHandler> = ({ priority, status }) => {
  if (status && !statusCheck(status)) return;
  if (priority && !priorityCheck(priority)) return;

  const body = getTasks({ priority, status });
  if (!body.length) {
    console.log(colors.red("❌ No tasks found!"));
    return;
  }
  generateTable(TASK_TABLE_HEADERS, covertDatetime(body));
};

export const tasks = new Command()
  .description("Display all the existings tasks")
  // Priority flag
  .complete(
    "priority",
    () => Object.values(TaskPriority),
  )
  .option(
    "-p, --priority <priority:string:priority>",
    "Displays tasks based on priority.",
  )
  // Status flag
  .complete(
    "status",
    () => Object.values(TaskStatus),
  )
  .option(
    "-s, --status <status:string:status>",
    "Displays tasks based on status.",
  )
  .action(action);
