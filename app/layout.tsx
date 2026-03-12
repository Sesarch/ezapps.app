import type { Metadata } from "next";
import { DM_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-body',
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ['400'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: "EZ Apps - E-commerce Tools",
  description: "Powerful tools for your e-commerce business",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={`${dmSans.variable} ${bebasNeue.variable} ${dmSans.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
