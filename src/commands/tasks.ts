import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { DB, Row } from "https://deno.land/x/sqlite/mod.ts";
import { TaskPriority, TaskStatus } from "../types/index.ts";
import { convertToReadableDueAndCreated } from "../utils/datetime.ts";
import { generateTable } from "../utils/tables.ts";

const generateQuery = ({ status, priority }: any) => {
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
  }, " WHERE");
  console.log(setQuery);
  return setQuery
    ? `SELECT * from tasks ${setQuery} ORDER BY created_at DESC`
    : "";
};

const getTasks = ({ priority, status }: any) => {
  const db = new DB("src/db/main.db");

  const tasks = db.query(generateQuery({ status, priority }));
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
  const headers = ["ID", "Title", "Status", "Priority", "Created", "Due"];
  const body = getTasks({ priority, status });
  generateTable(headers, covertDatetime(body));
};

export const tasks = new Command()
  .complete(
    "priority",
    () => [TaskPriority.LOW, TaskPriority.NORMAL, TaskPriority.HIGH],
  )
  .option(
    "-p, --priority <priority:string:priority>",
    "Displays tasks based on priority.",
  )
  .complete(
    "status",
    () => [TaskStatus.TODO, TaskStatus.DOING, TaskStatus.DONE],
  )
  .option(
    "-s, --status <status:string:status>",
    "Displays tasks based on status.",
  )
  .description("Display all the existings tasks")
  .action(action);
