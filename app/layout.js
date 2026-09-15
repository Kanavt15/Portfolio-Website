import './globals.css';
import Cursor       from '@/components/Cursor';
import Grain        from '@/components/Grain';
import SmoothScroll from '@/components/SmoothScroll';
import Nav          from '@/components/Nav';

export const metadata = {
  title: 'Kanav Trivedi — Developer & ML Engineer',
  description:
    'Portfolio of Kanav Trivedi — Computer Engineering student (Honors AIML), backend developer, and machine learning engineer based in Mumbai.',
  keywords: ['Kanav Trivedi', 'portfolio', 'backend developer', 'machine learning', 'Mumbai'],
  openGraph: {
    title: 'Kanav Trivedi — Developer & ML Engineer',
    description: 'Portfolio of Kanav Trivedi',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <SmoothScroll>
          <Cursor />
          <Grain />
          <Nav />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
