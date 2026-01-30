"use client";

import Header from "./ui/header";
import Footer from "./ui/footer";
import type React from "react";

/**
 * ClientLayout component that provides the main structural layout for the application.
 * Wraps the entire client-side application with a consistent header, main content area, and footer.
 * Uses flexbox layout to ensure the footer stays at the bottom and main content fills available space.
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The main content to be rendered in the layout's main section
 * @returns {JSX.Element} The complete page layout structure
 *
 * @example
 * ```tsx
 * import ClientLayout from './components/client-layout';
 *
 * function App() {
 *   return (
 *     <ClientLayout>
 *       <div className="container mx-auto px-4">
 *         <h1>Welcome to the App</h1>
 *         <p>Main application content goes here</p>
 *       </div>
 *     </ClientLayout>
 *   );
 * }
 * ```
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
