"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import FloatingHearts from "../components/FloatingHearts";
import Image from "next/image";

const PLACES = [
  {
    id: "sushi",
    emoji: "🍣",
    name: "Суши",
    desc: "Роллы, васаби и палочки 🥢",
    image: "/sushi.jpg",
  },
  {
    id: "coffee",
    emoji: "☕",
    name: "Кофейня",
    desc: "Латте и круассаны 🥐",
    image: "/coffee.jpg",
  },
  {
    id: "cinema",
    emoji: "🎬",
    name: "Кино",
    desc: "Попкорн и обнимашки 🍿",
    image: "/cinema.jpg",
  },
  {
    id: "park",
    emoji: "🌳",
    name: "Парк",
    desc: "Прогулка и мороженое 🍦",
    image: "/park.jpg",
  },
  {
    id: "restaurant",
    emoji: "🍝",
    name: "Ресторан",
    desc: "Ужин при свечах 🕯️",
    image: "/restaurant.jpg",
  },
  {
    id: "karaoke",
    emoji: "🎤",
    name: "Караоке",
    desc: "Споём вместе! 🎶",
    image: "/karaoke.jpg",
  },
];

const TIME_SLOTS = [
  "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00",
];

export default function ChoosePage() {
  const router = useRouter();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [step, setStep] = useState("place"); // "place" | "datetime"
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);

  // Generate the next 7 days for the date picker
  const dates = useMemo(() => {
    const days = [
      "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб",
    ];
    const months = [
      "янв", "фев", "мар", "апр", "мая", "июн",
      "июл", "авг", "сен", "окт", "ноя", "дек",
    ];
    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      result.push({
        key: d.toISOString().split("T")[0],
        dayName: days[d.getDay()],
        dayNum: d.getDate(),
        month: months[d.getMonth()],
        isToday: i === 0,
      });
    }
    return result;
  }, []);

  const handlePlaceConfirm = useCallback(() => {
    if (!selectedPlace) return;
    setStep("datetime");
  }, [selectedPlace]);

  const handleDateTimeConfirm = useCallback(() => {
    if (!selectedPlace || !selectedDate || !selectedTime) return;
    const place = PLACES.find((p) => p.id === selectedPlace);
    const dateObj = dates.find((d) => d.key === selectedDate);
    const params = new URLSearchParams({
      place: place.name,
      emoji: place.emoji,
      image: place.image,
      date: `${dateObj.dayName}, ${dateObj.dayNum} ${dateObj.month}`,
      time: selectedTime,
    });
    router.push(`/confirmed?${params.toString()}`);
  }, [selectedPlace, selectedDate, selectedTime, router, dates]);

  const selectedPlaceObj = PLACES.find((p) => p.id === selectedPlace);

  return (
    <>
      <FloatingHearts />
      <div className="page-container">
        {/* Progress dots */}
        <div className="progress-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className={`dot ${step === "place" ? "active" : ""}`}></div>
          <div className={`dot ${step === "datetime" ? "active" : ""}`}></div>
        </div>

        {step === "place" && (
          <>
            <h1 className="choose-title">Куда пойдём? 🗺️</h1>
            <p className="choose-subtitle">Выбирай, я на всё согласен(на)! 😄</p>

            <div className="places-grid">
              {PLACES.map((place) => (
                <div
                  key={place.id}
                  className={`place-card ${selectedPlace === place.id ? "selected" : ""}`}
                  onClick={() => setSelectedPlace(place.id)}
                >
                  <span className="place-emoji">{place.emoji}</span>
                  <span className="place-name">{place.name}</span>
                  <span className="place-desc">{place.desc}</span>
                  {selectedPlace === place.id && (
                    <span
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        fontSize: "1.2rem",
                      }}
                    >
                      ✅
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Preview selected place image */}
            {selectedPlaceObj && (
              <div className="place-preview" style={{
                marginTop: "1.2rem",
                animation: "cardSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}>
                <div style={{
                  width: 160,
                  height: 160,
                  borderRadius: 20,
                  overflow: "hidden",
                  margin: "0 auto",
                  boxShadow: "0 8px 25px rgba(233, 30, 99, 0.25)",
                }}>
                  <Image
                    src={selectedPlaceObj.image}
                    alt={selectedPlaceObj.name}
                    width={160}
                    height={160}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            )}

            <button
              className="btn-confirm"
              disabled={!selectedPlace}
              onClick={handlePlaceConfirm}
            >
              {selectedPlace ? "Дальше — выбрать время ⏰" : "Выбери место 👆"}
            </button>
          </>
        )}

        {step === "datetime" && (
          <div className="glass-card" style={{ animation: "cardAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}>
            <h2 className="choose-title" style={{ fontSize: "1.4rem" }}>
              {selectedPlaceObj?.emoji} Когда пойдём?
            </h2>
            <p className="choose-subtitle">Выбери день и время 📅</p>

            {/* Date selector */}
            <div className="date-picker-row">
              {dates.map((d) => (
                <div
                  key={d.key}
                  className={`date-chip ${selectedDate === d.key ? "date-chip-active" : ""}`}
                  onClick={() => setSelectedDate(d.key)}
                >
                  <span className="date-chip-day">{d.dayName}</span>
                  <span className="date-chip-num">{d.dayNum}</span>
                  <span className="date-chip-month">{d.month}</span>
                  {d.isToday && <span className="date-chip-today">сегодня</span>}
                </div>
              ))}
            </div>

            {/* Time slots */}
            {selectedDate && (
              <>
                <p style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#7b5ea7",
                  margin: "1rem 0 0.75rem",
                }}>
                  Во сколько? ⏰
                </p>
                <div className="time-slots-grid">
                  {TIME_SLOTS.map((t) => (
                    <div
                      key={t}
                      className={`time-chip ${selectedTime === t ? "time-chip-active" : ""}`}
                      onClick={() => setSelectedTime(t)}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="btn-confirm"
                style={{
                  background: "linear-gradient(135deg, #9e9e9e, #757575)",
                  padding: "0.8rem 1.5rem",
                  fontSize: "0.95rem",
                  animation: "none",
                }}
                onClick={() => setStep("place")}
              >
                ← Назад
              </button>
              <button
                className="btn-confirm"
                disabled={!selectedDate || !selectedTime}
                onClick={handleDateTimeConfirm}
                style={{ padding: "0.8rem 1.5rem", fontSize: "0.95rem" }}
              >
                {selectedDate && selectedTime ? "Подтвердить! 🚀" : "Выбери дату и время"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
