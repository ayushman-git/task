import { Command } from "cliffy/command/mod.ts";
import { create, edit, remove, tasks } from "commands";

export const setupCommands = async () => {
  const _commands = await new Command()
    .name("tasker")
    .description("Track tasks and notes from the terminal.")
    // Commands
    .command("create", create)
    .command("tasks", tasks)
    .command("remove", remove)
    .command("edit", edit)
    .parse(Deno.args);

  return _commands;
};
