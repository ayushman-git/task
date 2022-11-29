import { colors } from "cliffy/ansi/colors.ts";

export const logInternalError = () => {
  console.log(colors.red.bold("Some internal error has occured!"));
};
