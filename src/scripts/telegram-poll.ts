import { handleTelegramUpdate, type TelegramUpdate } from "@/lib/telegram/bot";

type UpdatesResponse = { ok: boolean; result: TelegramUpdate[] };
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is required for polling mode.");

const endpoint = (method: string) => `https://api.telegram.org/bot${token}/${method}`;
let running = true;
let offset = 0;

async function api<T>(method: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(endpoint(method), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json() as { ok: boolean; result: T };
  if (!response.ok || !data.ok) throw new Error(`Telegram ${method} failed`);
  return data.result;
}

async function poll() {
  await api<boolean>("deleteWebhook", { drop_pending_updates: false });
  console.log("Telegram bot polling started.");
  while (running) {
    try {
      const updates = await api<TelegramUpdate[]>("getUpdates", { offset, timeout: 25, allowed_updates: ["message", "callback_query"] });
      for (const update of updates) { offset = update.update_id + 1; await handleTelegramUpdate(update); }
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Telegram polling failed");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

process.on("SIGINT", () => { running = false; });
process.on("SIGTERM", () => { running = false; });
void poll();
