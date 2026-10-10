import "./globals.css";

export const metadata = {
  title: "💕 Пойдёшь со мной на свидание?",
  description: "Самое милое приглашение на свидание, от которого невозможно отказаться 💖",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
