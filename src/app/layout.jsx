import './globals.css'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'SETU — Precision Governance. Reimagined.',
  description: 'A secure digital platform for welfare policy implementation — dynamic registries, decentralized biometrics, and direct benefit transfers.',
}

const themeScript = `(function(){try{var t=localStorage.getItem('setu-theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-white text-neutral-950 antialiased dark:bg-neutral-950 dark:text-neutral-50">
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  )
}