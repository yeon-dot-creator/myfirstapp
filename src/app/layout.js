import "./globals.css";

export const metadata = {
  title: "한양대학교 웹 만들기",
  description: "현대적이고 아름다운 웹 애플리케이션",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <div className="page-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
