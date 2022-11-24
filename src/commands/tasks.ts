import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { generateTable } from "../utils/tables.ts";

const action = () => {
  generateTable();
};

export const tasks = new Command()
  .description("Display all the existings tasks")
  .action(action);
