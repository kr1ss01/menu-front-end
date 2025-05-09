import type { Metadata } from "next";
import "@/styles/globals.scss";
import { Jura } from 'next/font/google';

import * as React from 'react';
import Providers from "./utils/provider";
import { AuthContextProvider } from "./context/auth.contexts";
import Navbar from "./components/nabar";
import Footer from "./components/footer";

const jura = Jura({ subsets: ['latin', 'greek']});

export const metadata: Metadata = {
  title: "Μαύρο Πιπέρι || Online Menu",
  description: "Μαύρο Πιπέρι Online Menu. Το online menu για την αγαπημένη σας ταβέρνα στον Εύοσμο Θεσσαλονίκης. Σας περιμένουμε να ανακαλύωετε όλα τα υπέροχα πιάτα μας.",
  keywords: "μαύρο, πιπέρι, εύοσμος, ταβέρνα, εστιατόριο, black, mavro, piperi, pepper, evosmos, restaurant, tavern, food",
  icons: {
    icon: '/mp_c.png',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    }
  },
  category: "online menu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jura.className}>
        <AuthContextProvider>
          <Providers>
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </AuthContextProvider>
      </body>
    </html>
  );
}
