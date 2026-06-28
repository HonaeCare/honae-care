'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// ── Internationalisation légère, sans dépendance ────────────────────────────
// Un seul lien : la langue se change à l'écran via le sélecteur, sans recharger.
// Chaque texte porte ses 3 traductions côte à côte → aucune clé à synchroniser.
// Les valeurs STOCKÉES (options `value`) restent en français → le PDF et l'email
// du secrétariat restent en français quelle que soit la langue d'affichage.

export type Lang = 'fr' | 'en' | 'nl'
export type Dict = { fr: string; en: string; nl: string }

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'nl', label: 'NL' },
]

const LS_KEY = 'honae_lang'

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'fr',
  setLang: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr')

  // Restaure le choix précédent (ou la langue du navigateur au 1er passage)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved === 'fr' || saved === 'en' || saved === 'nl') {
        setLangState(saved)
        return
      }
      const nav = navigator.language.slice(0, 2).toLowerCase()
      if (nav === 'en' || nav === 'nl') setLangState(nav)
    } catch { /* ignore */ }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem(LS_KEY, l) } catch { /* ignore */ }
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

/** Retourne une fonction `t({fr,en,nl})` → la chaîne dans la langue courante. */
export function useT() {
  const { lang } = useLang()
  return (d: Dict) => d[lang]
}

/** Options Oui/Non localisées (l'usage le plus fréquent du formulaire). */
export function useCommonOptions() {
  const { lang } = useLang()
  const t = (d: Dict) => d[lang]
  return {
    ouiNon: [
      { value: 'oui', label: t({ fr: 'Oui', en: 'Yes', nl: 'Ja' }) },
      { value: 'non', label: t({ fr: 'Non', en: 'No', nl: 'Nee' }) },
    ],
    ouiNonNsp: [
      { value: 'oui', label: t({ fr: 'Oui', en: 'Yes', nl: 'Ja' }) },
      { value: 'non', label: t({ fr: 'Non', en: 'No', nl: 'Nee' }) },
      { value: 'je ne sais pas', label: t({ fr: 'Je ne sais pas', en: "Don't know", nl: 'Weet niet' }) },
    ],
    ouiNonDiscuter: [
      { value: 'oui', label: t({ fr: 'Oui', en: 'Yes', nl: 'Ja' }) },
      { value: 'non', label: t({ fr: 'Non', en: 'No', nl: 'Nee' }) },
      { value: 'à discuter', label: t({ fr: 'À discuter', en: 'To discuss', nl: 'Te bespreken' }) },
    ],
  }
}
