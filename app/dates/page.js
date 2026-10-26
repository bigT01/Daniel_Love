import { Suspense } from "react";
import { connection } from "next/server";
import { listChoices } from "../lib/db";

const DAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MONTHS = [
  "янв", "фев", "мар", "апр", "мая", "июн",
  "июл", "авг", "сен", "окт", "ноя", "дек",
];

function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${DAYS[date.getDay()]}, ${d} ${MONTHS[m - 1]}`;
}

async function Choices() {
  await connection();
  const choices = await listChoices();

  if (choices.length === 0) {
    return <p className="choose-subtitle">Пока никто не выбрал 🥺</p>;
  }

  return (
    <div className="dates-list">
      {choices.map((c) => (
        <div key={c.id} className="detail-row dates-item">
          <span className="detail-icon">{c.emoji}</span>
          <div>
            <div className="dates-item-main">
              {c.place} — {formatDate(c.date)}, {c.time}
            </div>
            <div className="dates-item-sub">
              выбрано{" "}
              {new Date(c.created_at).toLocaleString("ru-RU", {
                timeZone: process.env.DISPLAY_TZ || "Europe/Moscow",
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DatesPage() {
  return (
    <div className="page-container">
      <div className="glass-card">
        <h1 className="choose-title">Выбранные свидания 💌</h1>
        <Suspense fallback={<p className="choose-subtitle">💕 Загрузка...</p>}>
          <Choices />
        </Suspense>
      </div>
    </div>
  );
}
