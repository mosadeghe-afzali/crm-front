import './globals.css'

export const metadata = {
  title: 'CRM System',
  description: 'سیستم مدیریت CRM',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  )
}