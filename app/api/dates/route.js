import { saveChoice } from "../../lib/db";

export async function POST(request) {
  const { place, emoji, date, time } = await request.json();
  if (!place || !date || !time || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  await saveChoice({ place, emoji: emoji || "", date, time });
  return Response.json({ ok: true });
}
