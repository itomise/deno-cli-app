import { assertSpyCall, restore, spy, stub } from "@std/testing/mock";
import { expect } from "jsr:@std/expect";
import { logger } from "../common/logger.ts";
import { listOptionsFromCommandFiles, main } from "../cli.ts";
import { mainArgs } from "../common/util.ts";

Deno.test("add should add two numbers", () => {
  const add = (a: number, b: number): number => a + b;
  expect(add(1, 2)).toBe(3);
});

Deno.test(
  "should execute the hello command: from args",
  async () => {
    restore();

    stub(mainArgs, "get", () => ["hello"]);

    const fn = spy(logger, "info");
    await main();
    assertSpyCall(fn, 0, { args: ["Hello, World!"] });
  },
);

Deno.test("cli.ts: listOptions", async (t) => {
  const files = [
    "example/create.ts",
    "example/update.ts",
    "example/nest/nested1.ts",
    "example/nest/nested2.ts",
    "hello.ts",
  ];
  await t.step("root", () => {
    expect(listOptionsFromCommandFiles(files, "")).toEqual([
      "example/",
      "hello",
    ]);
  });
  await t.step("nested", () => {
    expect(listOptionsFromCommandFiles(files, "example/")).toEqual([
      "create",
      "update",
      "nest/",
    ]);
  });
  await t.step("multi-nested", () => {
    expect(listOptionsFromCommandFiles(files, "example/nest/")).toEqual([
      "nested1",
      "nested2",
    ]);
  });
});
