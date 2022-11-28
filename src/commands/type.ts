import { StringType } from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";

export interface IActionHandler {
  priority?: (StringType & string) | undefined;
  status?: (StringType & string) | undefined;
}
