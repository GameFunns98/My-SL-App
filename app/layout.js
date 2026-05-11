import './globals.css';

export const metadata = {
  title: 'Los Santos EMS Kalkulačka',
  description: 'Rychlá mobilní kalkulačka ošetření a služeb pro Los Santos EMS.',
  applicationName: 'EMS Kalkulačka',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EMS Kalkulačka',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
