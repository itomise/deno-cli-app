import $ from "jsr:@david/dax@^0.42.0";
import { parseArgs } from "jsr:@std/cli@1.0.8";
import { parse } from "jsr:@std/csv@^1.0.4";

const args = parseArgs(Deno.args);
const inputPath = args._[0];
if (!inputPath || typeof inputPath !== "string") Deno.exit(1);

const csvString = $.path(inputPath).resolve().readTextSync();
const data = parse(csvString, { columns: ["id", "value"], skipFirstRow: true });

const accessToken = await $`gcloud auth print-identity-token`.text();

for await (const { id, value } of data) {
  const apiRes = await fetch(`https://api.example.com/v1/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ value }),
  });
  if (!apiRes.ok) {
    console.error(`Failed to create request for id: ${id}`);
  }
}
