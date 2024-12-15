import $ from "@david/dax";
import { logger } from "./common/logger.ts";
import { parseArgs } from "@std/cli";
import { walk } from "@std/fs";
import { relative } from "@std/path";
import { mainArgs } from "./common/util.ts";

// commands ディレクトリからの相対パスでのコマンドファイル一覧を取得
const listCommandFiles = async (): Promise<string[]> => {
  const commandFiles: string[] = [];
  for await (
    const entry of walk(new URL("./commands", import.meta.url), {
      includeDirs: false,
      exts: [".ts"],
      // testファイルと、ファイル名の先頭が _ で始まるファイルをスキップ
      skip: [/\.test\.ts$/, /\/_[^/]*\.ts$/],
    })
  ) {
    const relativePath = relative(
      new URL("./commands/", import.meta.url).pathname,
      entry.path,
    );
    commandFiles.push(relativePath);
  }
  return commandFiles;
};

// コマンドファイルからユーザーに選択させるオプションを取得 (1階層ずつ再帰的)
export const listOptionsFromCommandFiles = (
  commandFiles: string[],
  dirPath: string,
): string[] => {
  const validatedDirPath = dirPath === "" || dirPath.endsWith("/")
    ? dirPath
    : dirPath + "/";

  const options: Set<string> = new Set();
  for (const commandFile of commandFiles) {
    if (commandFile.startsWith(validatedDirPath)) {
      const splitted = commandFile.slice(validatedDirPath.length).split("/");
      if (splitted[0]) {
        const option = splitted.length > 1
          ? splitted[0] + "/"
          : splitted[0].replace(/\.ts$/, "");
        options.add(option);
      }
    }
  }
  return Array.from(options);
};

const selectCommand = async (
  commandFiles: string[],
  dirPath: string = "",
): Promise<string> => {
  const options = listOptionsFromCommandFiles(commandFiles, dirPath);

  // options が一つの場合は確認して選択する (select が error になるため)
  if (options.length === 1) {
    const command = dirPath + options[0];
    const confirm = await $.confirm(
      `Do you want to execute the command: ${command}?`,
    );
    if (confirm) {
      return command;
    } else {
      logger.info("Command is canceled.");
      Deno.exit(0);
    }
  }

  const selectedIndex = await $.select({
    message: "Select a command",
    options,
  });

  const selected = options[selectedIndex];

  if (selected.endsWith("/")) {
    const nextDirPath = dirPath + selected;
    // 再帰的に選択
    return selectCommand(commandFiles, nextDirPath);
  }

  return dirPath + selected;
};

const executeCommand = async (commandFiles: string[], command: string) => {
  const commandFile = commandFiles.find((file) => file.startsWith(command));
  if (!commandFile) {
    throw new Error(`Command not found: ${command}`);
  }

  const commandFullPath = new URL(
    `./commands/${commandFile}`,
    import.meta.url,
  );
  await import(commandFullPath.href);
};

export const main = async () => {
  const args = parseArgs(mainArgs.get());
  const path = args._[0];

  const commandFiles = await listCommandFiles();

  let command: string | undefined = undefined;
  if (path && typeof path === "string") {
    const commandFile = commandFiles.find((file) => file.startsWith(path));
    if (!commandFile) {
      logger.error(`Command not found: ${path}`);
      Deno.exit(1);
    }
    command = path;
  } else {
    command = await selectCommand(commandFiles);
  }

  await executeCommand(commandFiles, command);
};

if (import.meta.main) {
  main();
}
