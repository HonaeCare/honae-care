import { LangProvider } from '@/lib/i18n'

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return <LangProvider>{children}</LangProvider>
}
