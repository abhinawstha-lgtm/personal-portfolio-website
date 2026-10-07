import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://abhinav-shrestha-ai-marketing.karensmithk605.chatgpt.site"),
  title: "AI Marketing Expert | Abhinav Shrestha",
  description: "Practical AI-powered digital marketing strategies for small and medium-sized businesses.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
