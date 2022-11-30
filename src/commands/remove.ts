import { DB } from "sql";
import { ActionHandler, Command } from "cliffy/command/mod.ts";
import { Confirm } from "cliffy/prompt/confirm.ts"
import { colors } from "cliffy/ansi/colors.ts";
import { logInternalError } from "utils";

interface IActionHandler {
  all?: boolean | undefined
}

const deleteTask = (tid: number) => {
  const db = new DB("src/db/main.db");
  try {
    // Destructuring to get the 0 or 1 in Row[]
    const [[idExist]] = db.query(
      `SELECT EXISTS(SELECT id FROM tasks WHERE id=${tid});`,
    );
    if (!idExist) {
      console.log(
        colors.red("Task ID"),
        colors.red.bold(tid.toString()),
        colors.red("doesn't exist!"),
      );
      return;
    }
    db.query(`DELETE FROM tasks
      WHERE id = ${tid}`);
  } catch (_) {
    logInternalError();
  } finally {
    db.close();
  }
  console.log(
    colors.green("Task ID"),
    colors.green.bold(tid.toString()),
    colors.green("successfully deleted!"),
  );
};

const action: ActionHandler<IActionHandler, [number]> = async ({all}, tid) => {
  if(all) {
    const confirmed: boolean = await Confirm.prompt("Can you confirm?");
    console.log(confirmed)
  }
  deleteTask(tid);
};

export const remove = new Command()
  .alias("rm")
  .arguments("<tid:number>")
  .description("Removes task(s)")
  // All flag
  .option("-a, --all [status:boolean]", "Deletes all the tasks.")
  .action(action);
