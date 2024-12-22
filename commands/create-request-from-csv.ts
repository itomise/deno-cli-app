import $ from "@david/dax";
import { parseArgs } from "@std/cli";
import { parse } from "@std/csv";
import { logger } from "../common/logger.ts";

const args = parseArgs(Deno.args);
const inputPath = args._[0];
if (!inputPath || typeof inputPath !== "string") Deno.exit(1);

const csvString = $.path(inputPath).resolve().readTextSync();
const data = parse(csvString, { columns: ["id", "value"], skipFirstRow: true });

const accessToken = await $`gcloud auth print-identity-token`.text();

for await (const { id, value } of data) {
  const apiRes = await fetch(`https://httpbin.org/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, value }),
  });
  if (!apiRes.ok) {
    console.error(`Failed to create request for id: ${id}`);
    Deno.exit(1);
  }
  logger.success(`Created request for id: ${id}`);
}
