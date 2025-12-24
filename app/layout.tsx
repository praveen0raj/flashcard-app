import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Flashcard App - Learn Smarter with Spaced Repetition",
  description: "A flashcard application featuring spaced repetition learning, quiz mode, and progress tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
