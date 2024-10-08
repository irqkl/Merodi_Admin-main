import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Aside from "../Components/AsideMenu/Aside";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="use-credentials" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet"></link>
            </head>
            <body className={inter.className}>
                <div className='contentWrapper'>
                    <Aside />
                    {children}
                </div>
            </body>
        </html>
    );
}
