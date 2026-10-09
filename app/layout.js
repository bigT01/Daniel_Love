import "./globals.css";

export const metadata = {
  title: "💕 Пойдёшь со мной на свидание?",
  description: "Самое милое приглашение на свидание, от которого невозможно отказаться 💖",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
