import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { create, edit, remove, tasks } from "./barrel.ts";

const commands = await new Command()
  .name("tasker")
  .description("Track tasks and notes from the terminal.")
  // Commands
  .command("create", create)
  .command("tasks", tasks)
  .command("remove", remove)
  .command("edit", edit)
  .parse(Deno.args);

export const setupCommands = () => {
  commands;
};
