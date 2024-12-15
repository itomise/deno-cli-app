## Installation

```shell
# 1. install deno (推奨: using shell)
# https://docs.deno.com/runtime/manual/getting_started/installation/

# 2. install app
deno task install
# shell でインストールした場合は自動でパスが通ります (~/.deno/bin にインストールされます)
# それ以外の場合は、コマンド後に出力されたパスを通してください

# 一度インストールしたら、ソースを変更しても再インストールする必要はありません。
# ただし、import map (deno.jsonc 内) を変更した場合は再インストールが必要です。
```

## Usage

```shell
# コマンド名は指定しなくても、インタラクティブに選択できます
demo-cli <command name>
```

## Dev

```shell
# dev run
deno task dev
```
