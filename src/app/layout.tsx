import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import AnimatedCursor from "react-animated-cursor";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrainsMono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hibike",
  description:
    "A Web3-powered marketplace where fans become music rights holders, and creators remix with freedom",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AnimatedCursor
            innerSize={10}
            outerSize={30}
            color="255, 255, 255"
            outerAlpha={0}
            innerScale={2}
            outerScale={3}
            clickables={[
              "h1",
              "h2",
              "h3",
              "a",
              "button",
              "svg",
              ".hover-element",
            ]}
            outerStyle={{
              backdropFilter: "invert(1)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
            innerStyle={{
              backdropFilter: "invert(1)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          />
          <main className="flex h-full flex-col items-center justify-center">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
