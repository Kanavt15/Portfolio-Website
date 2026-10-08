import "./house.css";
import "./reference.css";

export const metadata = {
  title: "Kanav Trivedi — Developer & ML Engineer",
  description:
    "Portfolio of Kanav Trivedi — Computer Engineering student (Honors AIML), backend developer, and machine learning engineer based in Mumbai.",
  keywords: [
    "Kanav Trivedi",
    "portfolio",
    "backend developer",
    "machine learning",
    "Mumbai",
  ],
  openGraph: {
    title: "Kanav Trivedi — Developer & ML Engineer",
    description: "Portfolio of Kanav Trivedi",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/outfit-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/dm-sans-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
