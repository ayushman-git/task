import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";

export const create = new Command()
  .description("Create a new task")
  .action(() => console.log("create"))
