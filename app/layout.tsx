import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Aeonik TRIAL ne couvre que l'ASCII de base (66 glyphes) : tous les caractères
// accentués tombent sur la police de secours. Inter est auto-hébergée par
// next/font (aucun appel à Google — RGPD) et sert de secours harmonieuse.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Honae Care — Formulaire d\'anamnèse',
  description: 'Formulaire d\'anamnèse fertilité — Honae Care, maison de fertilité belge',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
