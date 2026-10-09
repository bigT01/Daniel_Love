"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import FloatingHearts from "./components/FloatingHearts";
import Image from "next/image";

const SAD_EMOJIS = ["😢", "🥺", "😿", "💔", "😭", "🙁", "😞", "🫠"];
const PLEAD_TEXTS = [
  "Ну пожааалуйста 🥺",
  "Даже не думай отказать 😤",
  "Нууу... ладно, попробуй ещё раз 😏",
];

export default function HomePage() {
  const router = useRouter();
  const [noCount, setNoCount] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [noScale, setNoScale] = useState(1);
  const [sadEmojis, setSadEmojis] = useState([]);
  const [noHidden, setNoHidden] = useState(false);
  const cardRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // After initial mount animation, disable it so it never replays
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const handleNo = useCallback(() => {
    const newCount = noCount + 1;
    setNoCount(newCount);

    // Yes grows, No shrinks
    setYesScale((prev) => prev + 0.25);
    setNoScale((prev) => Math.max(prev - 0.3, 0.15));

    // Shake the card using the DOM directly — no re-render, no animation reset
    const card = cardRef.current;
    if (card) {
      card.classList.remove("card-shake");
      // Force reflow so the class re-add triggers the animation
      void card.offsetWidth;
      card.classList.add("card-shake");
    }

    // Spawn sad emoji at random position
    const newSad = {
      id: Date.now(),
      emoji: SAD_EMOJIS[Math.floor(Math.random() * SAD_EMOJIS.length)],
      x: 20 + Math.random() * 60,
      y: 30 + Math.random() * 40,
    };
    setSadEmojis((prev) => [...prev, newSad]);
    setTimeout(() => {
      setSadEmojis((prev) => prev.filter((e) => e.id !== newSad.id));
    }, 1200);

    // After 3 clicks, "No" disappears
    if (newCount >= 3) {
      setTimeout(() => setNoHidden(true), 300);
    }
  }, [noCount]);

  const handleYes = useCallback(() => {
    router.push("/yay");
  }, [router]);

  return (
    <>
      <FloatingHearts />

      {/* Sad emoji reactions */}
      {sadEmojis.map((e) => (
        <div
          key={e.id}
          className="sad-reaction"
          style={{ left: `${e.x}%`, top: `${e.y}%` }}
        >
          {e.emoji}
        </div>
      ))}

      <div className="page-container">
        {/* Progress dots */}
        <div className="progress-dots">
          <div className="dot active"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>

        <div
          ref={cardRef}
          className={`glass-card ${mounted ? "card-no-entry" : ""}`}
        >
          <div className="hero-image-wrapper">
            <Image
              src="/bear.jpg"
              alt="Cute bear with heart"
              width={220}
              height={220}
              priority
            />
          </div>

          <h1 className="title">Привет, солнышко! 🌟</h1>
          <p className="subtitle">У меня к тебе важный вопрос...</p>

          <p className="question-text">
            {noCount === 0 && "Ты пойдёшь со мной на свидание? 💕"}
            {noCount === 1 && PLEAD_TEXTS[0]}
            {noCount === 2 && PLEAD_TEXTS[1]}
            {noCount >= 3 && PLEAD_TEXTS[2]}
          </p>

          <div className="buttons-container">
            <button
              className="btn btn-yes"
              onClick={handleYes}
              style={{
                transform: `scale(${yesScale})`,
                transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              Да! 💖
            </button>

            {!noHidden && (
              <button
                className="btn btn-no"
                onClick={handleNo}
                style={{
                  transform: `scale(${noScale})`,
                  opacity: Math.max(noScale, 0.2),
                  transition:
                    "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease",
                }}
              >
                Нет 😅
              </button>
            )}
          </div>

          {noHidden && (
            <p
              style={{
                marginTop: "1rem",
                fontSize: "0.85rem",
                color: "#ec407a",
                fontWeight: 700,
              }}
            >
              Упс, кнопка «Нет» сбежала 🏃‍♂️💨
            </p>
          )}
        </div>
      </div>
    </>
  );
}
