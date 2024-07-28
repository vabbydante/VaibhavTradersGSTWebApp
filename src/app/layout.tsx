// src/app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import Navbar from '../components/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
