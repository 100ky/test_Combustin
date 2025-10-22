// Import necessary types and components.
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import Header from "@/components/layout/Header";
import Providers from "@/components/layout/Providers";
// Import global styles.
import "@/app/globals.css";

// Define metadata for the application.
export const metadata: Metadata = {
  title: "Combustion",
  description: "Combustion app",
};

/**
 * Root layout component for the application.
 * This component wraps all pages and provides a consistent layout.
 *
 * @param {object} props - The properties for the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The root layout element.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Set the language of the document to English.
    // suppressHydrationWarning is added to support next-themes.
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* ThemeProvider enables dark mode functionality. */}
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Your Providers component is nested inside. */}
          <Providers>
            {/* Render the Header component. */}
            <Header />
            {/* Main content area with your class changes. */}
            <main className="mt-24 md:mt-20">{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
