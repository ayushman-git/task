import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";

export const tasks = new Command()
  .description("Display all the existings tasks")
  .action(() => console.log("tasks"))
