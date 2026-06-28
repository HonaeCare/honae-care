'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MenopauseConfirmationPage() {
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    try { localStorage.removeItem('honae_menopause_draft_final') } catch { /* ignore */ }
  }, [])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const saved = sessionStorage.getItem('honae_menopause_draft_final')
      if (!saved) {
        alert('Les données du formulaire ne sont plus disponibles. Le PDF a déjà été téléchargé ou la session a expiré.')
        return
      }
      const data = JSON.parse(saved)
      const res = await fetch('/api/download-patient-menopause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erreur lors de la génération')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = res.headers.get('Content-Disposition')?.split('filename="')[1]?.replace('"', '') ?? 'anamnese-menopause.pdf'
      a.click()
      URL.revokeObjectURL(url)
      sessionStorage.removeItem('honae_menopause_draft_final')
    } catch {
      alert('Impossible de télécharger le PDF. Veuillez contacter Honae Care.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ecru flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-rose/40 p-8 text-center">
          <div className="w-16 h-16 bg-wine/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-wine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-wine mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Merci d&apos;avoir complété votre anamnèse
          </h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Votre formulaire a bien été reçu.
            Notre équipe se tient à votre disposition pour toutes questions complémentaires avant votre rendez-vous.
          </p>

          <button onClick={handleDownload} disabled={downloading} className="btn-primary w-full mb-4">
            {downloading ? 'Génération en cours…' : 'Télécharger mon exemplaire (PDF)'}
          </button>

          <Link href="/anamnese-menopause" className="text-xs text-gray-400 hover:text-wine transition-colors">
            Remplir un nouveau formulaire
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5 tracking-wide">
          Honae Care · Données de santé protégées (RGPD)
        </p>
      </div>
    </div>
  )
}
