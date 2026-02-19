import './globals.css'
import { Toaster } from 'react-hot-toast';



export const metadata = {
  title: 'CRM System',
  description: 'سیستم مدیریت CRM',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}