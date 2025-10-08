// app/layout.tsx (for App Router)

import { Poppins } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css' 
import Header from '@/components/Header'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-poppins'
})


const nohemi = localFont({
  src: [
    { path: './font/Nohemi-Regular-BF6438cc579d934.woff', weight: '400', style: 'normal' },
    { path: './font/Nohemi-Medium-BF6438cc57ddecd.woff',  weight: '500', style: 'medium' },
    { path: './font/Nohemi-Bold-BF6438cc577b524.woff',    weight: '700', style: 'bold' },
  ],
  variable: '--font-nohemi',
  display: 'swap',
})
export const metadata = {
  title: 'VertQual',
  description: '…',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${poppins.variable} ${nohemi.variable} font-poppins`}>
        


        <Header />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
