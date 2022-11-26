import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { create } from "./create.ts";
import { edit } from "./edit.ts";
import { remove } from "./remove.ts";
import { tasks } from "./tasks.ts";

const commands = await new Command()
  .name("tasker")
  .description("Track tasks and notes from the terminal.")
  .command("create", create)
  .command("tasks", tasks)
  .command("remove", remove)
  .command("edit", edit)
  .parse(Deno.args);

export const setupCommands = () => {
    commands;
}