'use client'
import { useLang, LANGS } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex justify-center gap-1.5 mb-5">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={`text-xs font-semibold px-2.5 py-1 rounded-md border transition-colors ${
            lang === l.code
              ? 'bg-wine text-white border-wine'
              : 'bg-white text-gray-400 border-gray-200 hover:border-wine/40 hover:text-wine'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
