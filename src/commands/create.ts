import {
  ActionHandler,
  Command,
} from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";

const action: ActionHandler = (_, message: string) => {
  console.log(message);
};

export const create = new Command()
  .arguments("<message>")
  .description("Create a new task")
  .action(action);
