"use client"

import { useState, useEffect, createContext, useContext } from "react"

type Language = "es" | "en"

interface Translations {
  [key: string]: {
    [key in Language]: string
  }
}

interface TranslationsContextType {
  language: Language
  changeLanguage: (newLanguage: Language) => void
  t: (key: string) => string
  isClient: boolean
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined)

const translations: Translations = {
  // Header
  "debt.management.panel": {
    es: "Panel de Gestión de Deudas",
    en: "Debt Management Panel",
  },
  "manage.debts.efficiently": {
    es: "Administra tus deudas e ingresos de manera eficiente",
    en: "Manage your debts and income efficiently",
  },
  "filter.by.month": {
    es: "Filtrar por mes:",
    en: "Filter by month:",
  },

  // Dashboard Cards
  receivable: {
    es: "Por Cobrar",
    en: "Receivable",
  },
  payable: {
    es: "Por Pagar",
    en: "Payable",
  },
  "expected.income": {
    es: "Ingresos Esperados",
    en: "Expected Income",
  },
  "projected.balance": {
    es: "Balance Proyectado",
    en: "Projected Balance",
  },
  "pending.debts": {
    es: "deudas pendientes",
    en: "pending debts",
  },
  "pending.income": {
    es: "ingresos pendientes",
    en: "pending income",
  },
  "draft.plans": {
    es: "planes en borrador",
    en: "draft plans",
  },

  // Tabs
  debts: {
    es: "Deudas",
    en: "Debts",
  },
  income: {
    es: "Ingresos",
    en: "Income",
  },
  projections: {
    es: "Proyecciones",
    en: "Projections",
  },
  reports: {
    es: "Reportes",
    en: "Reports",
  },

  // Debt Management
  "debt.management": {
    es: "Gestión de Deudas",
    en: "Debt Management",
  },
  "add.debt": {
    es: "Agregar Deuda",
    en: "Add Debt",
  },
  "receivable.debts": {
    es: "Deudas por Cobrar",
    en: "Receivable Debts",
  },
  "payable.debts": {
    es: "Deudas por Pagar",
    en: "Payable Debts",
  },
  "no.receivable.debts": {
    es: "No hay deudas por cobrar",
    en: "No receivable debts",
  },
  "no.payable.debts": {
    es: "No hay deudas por pagar",
    en: "No payable debts",
  },

  // Income Management
  "expected.income.management": {
    es: "Ingresos Esperados",
    en: "Expected Income",
  },
  "add.income": {
    es: "Agregar Ingreso",
    en: "Add Income",
  },
  "no.income.registered": {
    es: "No hay ingresos registrados",
    en: "No income registered",
  },

  // Projections
  "next.month.projections": {
    es: "Proyecciones del Próximo Mes",
    en: "Next Month Projections",
  },
  "new.projection": {
    es: "Nueva Proyección",
    en: "New Projection",
  },
  "no.projections.created": {
    es: "No hay proyecciones creadas",
    en: "No projections created",
  },

  // Status
  pending: {
    es: "Pendiente",
    en: "Pending",
  },
  paid: {
    es: "Pagado",
    en: "Paid",
  },
  received: {
    es: "Cobrado",
    en: "Received",
  },
  surplus: {
    es: "Superávit",
    en: "Surplus",
  },
  deficit: {
    es: "Déficit",
    en: "Deficit",
  },

  // Actions
  "partial.payment": {
    es: "Pago Parcial",
    en: "Partial Payment",
  },
  "mark.complete": {
    es: "Marcar Completo",
    en: "Mark Complete",
  },
  "mark.as.received": {
    es: "Marcar como Cobrado",
    en: "Mark as Received",
  },
  "mark.as.paid": {
    es: "Marcar como Pagado",
    en: "Mark as Paid",
  },
  edit: {
    es: "Editar",
    en: "Edit",
  },
  delete: {
    es: "Eliminar",
    en: "Delete",
  },
  cancel: {
    es: "Cancelar",
    en: "Cancel",
  },
  save: {
    es: "Guardar",
    en: "Save",
  },
  add: {
    es: "Agregar",
    en: "Add",
  },
  update: {
    es: "Actualizar",
    en: "Update",
  },

  // Forms
  description: {
    es: "Descripción",
    en: "Description",
  },
  amount: {
    es: "Monto",
    en: "Amount",
  },
  "due.date": {
    es: "Fecha de Vencimiento",
    en: "Due Date",
  },
  "expected.date": {
    es: "Fecha Esperada",
    en: "Expected Date",
  },
  category: {
    es: "Categoría",
    en: "Category",
  },
  notes: {
    es: "Notas",
    en: "Notes",
  },
  type: {
    es: "Tipo",
    en: "Type",
  },

  // Partial Payments
  "partial.payments": {
    es: "Pagos Parciales",
    en: "Partial Payments",
  },
  "original.amount": {
    es: "Monto original",
    en: "Original amount",
  },
  "partial.paid": {
    es: "Pagos parciales",
    en: "Partial payments",
  },
  remaining: {
    es: "Restante",
    en: "Remaining",
  },
  due: {
    es: "Vence",
    en: "Due",
  },

  // Theme
  "toggle.theme": {
    es: "Cambiar tema",
    en: "Toggle theme",
  },
  light: {
    es: "Claro",
    en: "Light",
  },
  dark: {
    es: "Oscuro",
    en: "Dark",
  },
  system: {
    es: "Sistema",
    en: "System",
  },
}

export function TranslationsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    if (isClient) {
      localStorage.setItem("language", newLanguage)
    }
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  const value = { language, changeLanguage, t, isClient }

  return (
    <TranslationsContext.Provider value={value}>
      {children}
    </TranslationsContext.Provider>
  )
}

export function useTranslations() {
  const context = useContext(TranslationsContext)
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationsProvider')
  }
  return context
} 