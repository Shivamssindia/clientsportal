import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SoftMax Technologies & IT Services | AI-Powered Digital Systems",
  description:
    "SoftMax Technologies & IT Services delivers high-velocity, scalable digital systems engineered to perform under pressure. Zero technical anxiety, measurable business ROI, sub-second response times, and modern cloud/AI-driven software solutions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}










// // src\app\layout.tsx
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css"
// import { ThemeProvider } from "next-themes";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Gaurion Bharat | Making Talent Visible, Delivering Impact",
//   description: "Gaurion Bharat - Making Talent Visible, Delivering Measurable Impact",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html
//       lang="en"
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <head>
//         <link
//           rel="stylesheet"
//           href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
//         />
//       </head>
//       <body className="min-h-full flex flex-col">
//         {/* <ThemeProvider attribute={'data-theme'} defaultTheme="dark"> */}
//         {children}
//         {/* </ThemeProvider> */}
//         </body>
//     </html>
//   );
// }


// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { AuthProvider } from "@/contexts/AuthContext";

// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Gaurion Bharat | Making Talent Visible, Delivering Impact",
//   description: "Gaurion Bharat - Making Talent Visible, Delivering Measurable Impact",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
//       <head>
//         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
//       </head>
//       <body className="min-h-full flex flex-col">
//         <AuthProvider>{children}</AuthProvider>
//       </body>
//     </html>
//   );
// }