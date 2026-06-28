'use client'
import { useLang, LANGS } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'

const NAMES: Record<Lang, string> = {
  fr: 'Français',
  en: 'English',
  nl: 'Nederlands',
}

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  return (
    <div className="relative inline-block">
        <svg
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-wine/70"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20" />
        </svg>
        <select
          aria-label="Langue / Language / Taal"
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          className="appearance-none cursor-pointer rounded-lg border border-rose/60 bg-white py-1.5 pl-7 pr-7 text-xs font-semibold text-wine hover:border-wine/50 focus:outline-none focus:ring-2 focus:ring-rose/50"
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>{NAMES[l.code]}</option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-wine/60"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
    </div>
  )
}
