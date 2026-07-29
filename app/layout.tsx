import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Home Goods Manager',
  description: 'Track and manage your household inventory',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
