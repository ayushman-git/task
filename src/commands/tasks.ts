import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { DB, Row } from "https://deno.land/x/sqlite/mod.ts";
import { convertToReadableDueAndCreated } from "../utils/datetime.ts";
import { generateTable } from "../utils/tables.ts";

const getTasks = () => {
  const db = new DB("src/db/main.db");

  const tasks = db.query("SELECT * from tasks ORDER BY created_at DESC");
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

const action = () => {
  const headers = ["ID", "Title", "Status", "Priority", "Created", "Due"];
  const body = getTasks();
  generateTable(headers, covertDatetime(body));
};

export const tasks = new Command()
  .description("Display all the existings tasks")
  .action(action);
