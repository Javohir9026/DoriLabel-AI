import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const envFile = existsSync(resolve(".env")) ? ["--env-file=.env"] : [];
const processes = [
  spawn(process.execPath, [resolve("node_modules/next/dist/bin/next"), "dev"], { stdio: "inherit" }),
  spawn(process.execPath, [...envFile, "--import", "tsx", "src/scripts/telegram-poll.ts"], { stdio: "inherit" }),
];

const stop = () => processes.forEach((child) => child.kill("SIGTERM"));
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
processes.forEach((child) => child.on("exit", (code) => { if (code && code !== 0) { stop(); process.exitCode = code; } }));
