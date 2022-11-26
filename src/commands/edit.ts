import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";


const action = (_, tid: number) => {
  
};

export const edit = new Command()
.arguments("<tid:number>")
  .description("Edit a task")
  .action(action);
