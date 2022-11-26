import { colors } from "https://deno.land/x/cliffy@v0.25.4/ansi/colors.ts";
import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

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
    console.log(colors.red.bold("Some internal error has occured!"));
  } finally {
    db.close();
  }
  console.log(
    colors.green("Task ID"),
    colors.green.bold(tid.toString()),
    colors.green("successfully deleted!"),
  );
};

const action = (_: any, tid: number) => {
  deleteTask(tid);
};

export const remove = new Command()
  .alias("rm")
  .arguments("<tid:number>")
  .description("Removes task(s)")
  .action(action);
