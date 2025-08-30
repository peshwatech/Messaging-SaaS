import type { Metadata } from "next";
// Using corrected relative paths based on your project structure.
import { ThemeProvider } from "../components/theme-provider";
import "../components/styles/globals.css";

export const metadata: Metadata = {
  title: "CampaignPro",
  description: "A professional dashboard for managing campaigns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Font optimizations have been removed to prevent build errors */}
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

