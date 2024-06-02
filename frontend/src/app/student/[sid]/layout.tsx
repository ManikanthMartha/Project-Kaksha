import { Caudex } from 'next/font/google'
import { Cormorant_Garamond } from 'next/font/google'
import '../../globals.css'

const caudex = Caudex({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caudex',
  weight: '400'
})
const cormorant_garamond = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant_garamond',
  weight: '400'
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={caudex.variable + ' ' + cormorant_garamond.variable}>
        {children}
      </body>
    </html>
  )
}