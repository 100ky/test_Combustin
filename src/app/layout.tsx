// Import necessary types and components.
import type { Metadata } from "next";

import Header from "@/components/layout/Header";
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
    <html lang="en">
      <body>
        {/* Render the Header component. */}
        <Header />
        {/* Main content area for the pages. */}
        <main className="mt-24 md:mt-20">{children}</main>
      </body>
    </html>
  );
}