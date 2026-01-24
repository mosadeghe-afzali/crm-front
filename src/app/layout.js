import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "crm-dashboard",
  description: "خرید و فروش آسان و سریع در سراسر ایران",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />

        
      </head>
      <body className="bg-[#f3f3f3] text-gray-800 font-sans">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
