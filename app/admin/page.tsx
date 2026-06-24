'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { SubmissionMeta } from '@/lib/storage'

export default function AdminDashboard() {
  const router = useRouter()

  const [submissions, setSubmissions] = useState<SubmissionMeta[]>([])
  const [search, setSearch] = useState('')
  const [loadingSubmissions, setLoadingSubmissions] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const loadSubmissions = useCallback(() => {
    setLoadingSubmissions(true)
    fetch('/api/admin/submissions')
      .then((r) => {
        if (r.status === 401) { router.push('/admin/login'); return null }
        return r.json()
      })
      .then((data) => { if (data) setSubmissions(data) })
      .finally(() => setLoadingSubmissions(false))
  }, [router])

  useEffect(() => { loadSubmissions() }, [loadSubmissions])

  const deleteSubmission = async (id: string, name: string) => {
    if (!confirm(`Supprimer définitivement le dossier de ${name} ?\nCette action est irréversible.`)) return
    setDeletingId(id)
    try {
      await fetch(`/api/admin/submissions/${id}`, { method: 'DELETE' })
      loadSubmissions()
    } finally {
      setDeletingId(null)
    }
  }

  // Calcule les jours restants avant suppression automatique
  const daysUntilExpiry = (dateStr: string) => {
    const diff = 30 - Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }

  const filtered = submissions.filter((s) =>
    `${s.prenom} ${s.nom}`.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('fr-BE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  return (
    <div className="min-h-screen bg-ecru">
      {/* Header */}
      <header className="bg-wine shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-rose uppercase">Secrétariat</p>
            <h1 className="text-xl font-semibold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Honae Care
            </h1>
          </div>
          <button
            onClick={logout}
            className="text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/50 px-4 py-1.5 rounded-lg transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-wine">Formulaires reçus</h2>
            <p className="text-sm text-gray-400">{filtered.length} dossier(s)</p>
          </div>
          <input
            type="search"
            placeholder="Rechercher par nom…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field-input max-w-xs bg-white"
          />
        </div>

        {loadingSubmissions ? (
          <div className="text-center py-16 text-gray-400">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            {search ? 'Aucun résultat pour cette recherche.' : 'Aucun formulaire reçu pour le moment.'}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-rose/30 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rose/30">
                  <th className="px-5 py-3 text-left text-xs font-bold text-wine uppercase tracking-widest">Patient·e</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-wine uppercase tracking-widest hidden sm:table-cell">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-wine uppercase tracking-widest hidden md:table-cell">Expire dans</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-wine uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const days = daysUntilExpiry(s.date)
                  return (
                    <tr key={s.id} className={`border-t border-gray-50 hover:bg-ecru transition-colors ${i % 2 === 0 ? '' : 'bg-ecru/50'}`}>
                      <td className="px-5 py-3.5 font-medium text-gray-800">{s.prenom} {s.nom}</td>
                      <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">{formatDate(s.date)}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          days <= 5
                            ? 'bg-red-50 text-red-500'
                            : days <= 10
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-green-50 text-green-600'
                        }`}>
                          {days}j
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`/api/admin/submissions/${s.id}/download`}
                            className="btn-primary text-xs px-3 py-1.5 inline-block"
                            download
                          >
                            Télécharger
                          </a>
                          <button
                            onClick={() => deleteSubmission(s.id, `${s.prenom} ${s.nom}`)}
                            disabled={deletingId === s.id}
                            className="text-xs text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                          >
                            {deletingId === s.id ? '…' : 'Supprimer'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
