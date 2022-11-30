import { setupCommands } from "./commands/index.ts";
import { initializeDb } from "./db/index.ts";

(async function setup() {
  initializeDb();
  await setupCommands();
})();
