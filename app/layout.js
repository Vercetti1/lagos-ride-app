import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import AuthProvider from "../components/SessionProvider";
import { ToastProvider } from "../hooks/useToast";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
});

export const metadata = {
  title: "Lagos Ride - Future of Transport",
  description: "Experience the next generation of ride-hailing in Lagos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <AuthProvider>
          <ToastProvider>
            <Header />
            <main>
              {children}
            </main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
