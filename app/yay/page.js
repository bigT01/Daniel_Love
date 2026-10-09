"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FloatingHearts from "../components/FloatingHearts";
import Image from "next/image";

export default function YayPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/choose");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <>
      <FloatingHearts />
      <div className="page-container">
        {/* Progress dots */}
        <div className="progress-dots">
          <div className="dot"></div>
          <div className="dot active"></div>
          <div className="dot"></div>
        </div>

        <div className="glass-card" style={{ overflow: "visible" }}>
          <div style={{ marginBottom: "0.5rem" }}>
            <span className="confetti-emoji">🎉</span>
            <span className="confetti-emoji" style={{ animationDelay: "0.2s" }}>🥳</span>
            <span className="confetti-emoji" style={{ animationDelay: "0.4s" }}>🎊</span>
          </div>

          <h1 className="yay-text">УРАААА!!!</h1>
          <p className="yay-subtitle">Я знал(а) что ты скажешь да! 😍</p>

          <div className="celebration-image">
            <Image
              src="/celebration.jpg"
              alt="Celebration"
              width={300}
              height={300}
              priority
            />
          </div>

          <p style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#4a1942",
            marginBottom: "0.5rem",
          }}>
            Это будет лучшее свидание! 🌟💕
          </p>

          <p style={{
            fontSize: "1rem",
            color: "#7b5ea7",
            fontWeight: 600,
          }}>
            А теперь давай выберем куда пойдём... 🤔
          </p>

          <p className="redirect-text">
            Переход через {countdown} сек... ⏳
          </p>
        </div>
      </div>
    </>
  );
}
