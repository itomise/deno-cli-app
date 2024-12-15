import { logger } from "../common/logger.ts";
import { parseArgs } from "@std/cli";

const args = parseArgs(Deno.args, {
  string: ["name"],
  alias: { name: "n" },
});

console.log(args); // demo-cli hello --name=David => { _: [ "hello" ], name: "David", n: "David" }

logger.info("Hello, World!");
