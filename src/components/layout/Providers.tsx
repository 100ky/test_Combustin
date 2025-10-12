"use client";

import { SessionProvider } from "next-auth/react";

/**
 * A client-side component that wraps the application with the NextAuth `SessionProvider`.
 * This makes the session data available to all components down the tree.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} The rendered component.
 * @see https://next-auth.js.org/getting-started/client#sessionprovider
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
