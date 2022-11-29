import { colors } from "cliffy/ansi/colors.ts";
import { ActionHandler, Command, StringType } from "cliffy/command/mod.ts";
import { DB, Row } from "sql";
import { IActionHandler, TaskPriority, TaskStatus } from "types";
import {
  convertToReadableDueAndCreated,
  generateTable,
  priorityCheck,
  statusCheck,
  TASK_TABLE_HEADERS,
} from "utils";

interface IActionHandlerExt extends IActionHandler {
  sort?: (StringType & string) | undefined;
  reverse?: boolean | undefined;
}

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

const sortQuery = ({ reverse, sort }: IActionHandlerExt) => {
  let sortStr = "ORDER BY created_at DESC";

  if (sort === "priority") {
    sortStr = `ORDER BY 
    CASE priority
      WHEN 'low' THEN 0
      WHEN 'normal' THEN 1
      WHEN 'high' THEN 2
    END ${reverse ? "ASC" : "DESC"},
    created_at DESC`;
  }
  return sortStr;
};

const getTasks = ({ status, priority, sort, reverse }: IActionHandlerExt) => {
  const db = new DB("src/db/main.db");
  const tasks = db.query(
    `SELECT * from tasks ${selectiveQuery({ status, priority })} ${
      sortQuery({ reverse, sort })
    }`,
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

const action: ActionHandler<IActionHandlerExt> = (
  { priority, status, reverse, sort },
) => {
  if (status && !statusCheck(status)) return;
  if (priority && !priorityCheck(priority)) return;

  const body = getTasks({ priority, status, reverse, sort });
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
  // Sorting flag
  .option(
    "-srt, --sort <sort:string>",
    "Sort tasks.",
  )
  // Reverse flag
  .option(
    "-r, --reverse [reverse:boolean]",
    "Reverses the sorted output.",
    { default: false },
  )
  .action(action);
