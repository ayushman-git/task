import { Command } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { parseFlags } from "https://deno.land/x/cliffy@v0.25.4/flags/mod.ts";

import { flags } from "./utils/flags.ts";

console.log(flags)

// await new Command()
//   .name("cliffy")
//   .version("0.1.0")
//   .arguments("abc")
//   .description("Command line framework for Deno")
//   .action(() => {
//     console.log("CLIFF")
//   })
//   .parse(Deno.args);

