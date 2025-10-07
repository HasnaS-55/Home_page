// app/layout.tsx (for App Router)

import { Poppins } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css' 
import Header from '@/components/Header'
import BlobCursor from '@/components/BlobCursor';
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
        <BlobCursor
  blobType="circle"
  fillColor="#1C4B24"
  trailCount={3}
  sizes={[20, 20, 15]}
  innerSizes={[10, 18, 14]}
  innerColor="#D7F78190"
  opacities={[0.9, 0.7, 0.5]}
  shadowColor="#1C4B24"
  shadowBlur={2}
  useFilter={true}
  fastDuration={0.1}
  slowDuration={0.3}
  filterStdDeviation={8} // Much lower for less blur
  filterColorMatrixValues="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -5" // Better values
/>


        <Header />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
