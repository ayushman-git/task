import { colors } from "https://deno.land/x/cliffy@v0.25.4/ansi/colors.ts";

export const logInternalError = () => {
  console.log(colors.red.bold("Some internal error has occured!"));
};
