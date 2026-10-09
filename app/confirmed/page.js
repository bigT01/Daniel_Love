"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import FloatingHearts from "../components/FloatingHearts";
import Image from "next/image";

function ConfirmedContent() {
  const searchParams = useSearchParams();
  const place = searchParams.get("place") || "Суши";
  const emoji = searchParams.get("emoji") || "🍣";
  const image = searchParams.get("image") || "/sushi.jpg";
  const date = searchParams.get("date") || "Сегодня";
  const time = searchParams.get("time") || "18:00";

  return (
    <>
      <FloatingHearts />
      <div className="page-container">
        <div className="glass-card confirmed-card">
          <div className="confirmed-emoji">
            {emoji} 💕
          </div>

          <h1 className="confirmed-title">Свидание назначено!</h1>
          <p className="confirmed-place">{place}</p>

          <div className="confirmed-image">
            <Image
              src={image}
              alt={place}
              width={260}
              height={260}
              priority
            />
          </div>

          <div className="confirmed-details">
            <div className="detail-row">
              <span className="detail-icon">📅</span>
              <span>{date}</span>
            </div>
            <div className="detail-row">
              <span className="detail-icon">⏰</span>
              <span>{time}</span>
            </div>
            <div className="detail-row">
              <span className="detail-icon">📍</span>
              <span>{place} {emoji}</span>
            </div>
            <div className="detail-row">
              <span className="detail-icon">👗</span>
              <span>Одевайся красиво! ✨</span>
            </div>
          </div>

          <div className="heart-divider">💕 💖 💕</div>

          <p className="confirmed-footer">
            Я заеду за тобой в {time}! 🚗💨
            <br />
            Готовься к лучшему свиданию 🌟
            <br />
            <br />
            <span style={{ fontSize: "1.5rem" }}>
              🐻❤️🐻
            </span>
          </p>


        </div>
      </div>
    </>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="page-container">
          <div className="glass-card">
            <p style={{ fontSize: "2rem" }}>💕 Загрузка...</p>
          </div>
        </div>
      }
    >
      <ConfirmedContent />
    </Suspense>
  );
}
