import { NextRequest, NextResponse } from "next/server";
import { handleTelegramUpdate, type TelegramUpdate } from "@/lib/telegram/bot";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && request.headers.get("x-telegram-bot-api-secret-token") !== secret) return NextResponse.json({ ok: false }, { status: 401 });
  try { await handleTelegramUpdate(await request.json() as TelegramUpdate); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ ok: false }, { status: 500 }); }
}
