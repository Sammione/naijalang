import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import LiveMeetingModal from "@/components/LiveMeetingModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nija Language Hub | Nigerian Heritage Languages",
  description: "Learn Igbo, Yoruba, and Ibibio through live human instruction, structured curriculum, and cultural connection.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body>
        <AppProvider>
          {children}
          <LiveMeetingModal />
        </AppProvider>
      </body>
    </html>
  );
}

