import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TranslationsProvider } from "@/hooks/use-translations"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Panel de Gestión de Deudas Personales",
  description: "Administra tus deudas e ingresos de manera eficiente con proyecciones y pagos parciales",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TranslationsProvider>
            {children}
          </TranslationsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
