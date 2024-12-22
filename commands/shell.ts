import $ from "@david/dax";
import { parseArgs } from "@std/cli";

// demo-cli hello --name=David => { _: [ "hello" ], name: "David", n: "David" }
const args = parseArgs(Deno.args, {
  string: ["name"],
  alias: { name: "n" },
});

await $`echo Hello, ${args.name || "World"}!`;
