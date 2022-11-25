import { setupCommands } from "./commands/index.ts";
import { initializeDb } from "./db/index.ts";

(function setup() {
//   initializeDb();
  setupCommands();
})();
