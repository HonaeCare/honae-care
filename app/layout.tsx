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
  // Bandeau visible UNIQUEMENT sur l'environnement de test (variable définie
  // sur le staging Railway). En production la variable est absente → rien ne s'affiche.
  const isStaging = process.env.NEXT_PUBLIC_APP_ENV === 'staging'
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        {isStaging && (
          <div style={{
            position: 'sticky', top: 0, zIndex: 9999,
            background: '#B45309', color: '#fff',
            textAlign: 'center', padding: '6px 12px',
            fontSize: 13, fontWeight: 700, letterSpacing: '0.05em',
          }}>
            ⚠️ ENVIRONNEMENT DE TEST — ne pas utiliser pour de vrais patients
          </div>
        )}
        {children}
      </body>
    </html>
  )
}
