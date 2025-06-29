"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { DollarSign, TrendingUp, TrendingDown, FileText, Plus } from "lucide-react"
import { format, addMonths } from "date-fns"
import { DebtForm } from "../components/debt-form"
import { IncomeForm } from "../components/income-form"
import { DebtCard } from "../components/debt-card"
import { IncomeCard } from "../components/income-card"
import { ReportsSection } from "../components/reports-section"
import { ProjectionForm } from "../components/projection-form"
import { ProjectionCard } from "../components/projection-card"
import { ThemeToggle } from "../components/theme-toggle"
import { LanguageToggle } from "../components/language-toggle"
import { useTranslations } from "../hooks/use-translations"

interface Debt {
  id: string
  type: "receivable" | "payable"
  description: string
  amount: number
  dueDate: string
  status: "pending" | "paid" | "received"
  category: string
  notes?: string
}

interface Income {
  id: string
  description: string
  amount: number
  expectedDate: string
  status: "pending" | "received"
  category: string
}

interface Projection {
  id: string
  name: string
  month: string
  debtsToReceive: { id: string; amount: number; description: string }[]
  debtsToPayy: { id: string; amount: number; description: string }[]
  expectedBalance: number
  notes?: string
  createdAt: string
}

interface PartialPayment {
  id: string
  debtId: string
  amount: number
  date: string
  notes?: string
  createdAt: string
}

export default function DebtManagementPanel() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"))
  const [projections, setProjections] = useState<Projection[]>([])
  const [isAddProjectionOpen, setIsAddProjectionOpen] = useState(false)
  const [paymentPlans, setPaymentPlans] = useState<any[]>([])
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false)
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false)
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [partialPayments, setPartialPayments] = useState<PartialPayment[]>([])

  const { t } = useTranslations()

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedDebts = localStorage.getItem("debts")
    const savedIncomes = localStorage.getItem("incomes")
    const savedPlans = localStorage.getItem("paymentPlans")
    const savedProjections = localStorage.getItem("projections")

    if (savedDebts) setDebts(JSON.parse(savedDebts))
    if (savedIncomes) setIncomes(JSON.parse(savedIncomes))
    if (savedPlans) setPaymentPlans(JSON.parse(savedPlans))
    if (savedProjections) setProjections(JSON.parse(savedProjections))
    const savedPartialPayments = localStorage.getItem("partialPayments")
    if (savedPartialPayments) setPartialPayments(JSON.parse(savedPartialPayments))
  }, [])

  // Guardar datos en localStorage
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data))
  }

  // Funciones para manejar deudas
  const addDebt = (debtData: Omit<Debt, "id">) => {
    const newDebt = { ...debtData, id: Date.now().toString() }
    const updatedDebts = [...debts, newDebt]
    setDebts(updatedDebts)
    saveToStorage("debts", updatedDebts)
  }

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    const updatedDebts = debts.map((debt) => (debt.id === id ? { ...debt, ...updates } : debt))
    setDebts(updatedDebts)
    saveToStorage("debts", updatedDebts)
  }

  const deleteDebt = (id: string) => {
    const updatedDebts = debts.filter((debt) => debt.id !== id)
    setDebts(updatedDebts)
    saveToStorage("debts", updatedDebts)
  }

  // Funciones para manejar ingresos
  const addIncome = (incomeData: Omit<Income, "id">) => {
    const newIncome = { ...incomeData, id: Date.now().toString() }
    const updatedIncomes = [...incomes, newIncome]
    setIncomes(updatedIncomes)
    saveToStorage("incomes", updatedIncomes)
  }

  const updateIncome = (id: string, updates: Partial<Income>) => {
    const updatedIncomes = incomes.map((income) => (income.id === id ? { ...income, ...updates } : income))
    setIncomes(updatedIncomes)
    saveToStorage("incomes", updatedIncomes)
  }

  const deleteIncome = (id: string) => {
    const updatedIncomes = incomes.filter((income) => income.id !== id)
    setIncomes(updatedIncomes)
    saveToStorage("incomes", updatedIncomes)
  }

  // Funciones para manejar planes de pago
  const addPaymentPlan = (planData: Omit<any, "id">) => {
    const newPlan = { ...planData, id: Date.now().toString() }
    const updatedPlans = [...paymentPlans, newPlan]
    setPaymentPlans(updatedPlans)
    saveToStorage("paymentPlans", updatedPlans)
  }

  const updatePaymentPlan = (id: string, updates: Partial<any>) => {
    const updatedPlans = paymentPlans.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan))
    setPaymentPlans(updatedPlans)
    saveToStorage("paymentPlans", updatedPlans)
  }

  const deletePaymentPlan = (id: string) => {
    const updatedPlans = paymentPlans.filter((plan) => plan.id !== id)
    setPaymentPlans(updatedPlans)
    saveToStorage("paymentPlans", updatedPlans)
  }

  // Funciones para manejar proyecciones
  const addProjection = (projectionData: Omit<Projection, "id" | "createdAt">) => {
    const newProjection = {
      ...projectionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    const updatedProjections = [...projections, newProjection]
    setProjections(updatedProjections)
    saveToStorage("projections", updatedProjections)
  }

  const updateProjection = (id: string, updates: Partial<Projection>) => {
    const updatedProjections = projections.map((projection) =>
      projection.id === id ? { ...projection, ...updates } : projection,
    )
    setProjections(updatedProjections)
    saveToStorage("projections", updatedProjections)
  }

  const deleteProjection = (id: string) => {
    const updatedProjections = projections.filter((projection) => projection.id !== id)
    setProjections(updatedProjections)
    saveToStorage("projections", updatedProjections)
  }

  // Funciones para manejar pagos parciales
  const addPartialPayment = (paymentData: Omit<PartialPayment, "id" | "createdAt">) => {
    const newPayment = {
      ...paymentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    const updatedPayments = [...partialPayments, newPayment]
    setPartialPayments(updatedPayments)
    saveToStorage("partialPayments", updatedPayments)
  }

  const deletePartialPayment = (id: string) => {
    const updatedPayments = partialPayments.filter((payment) => payment.id !== id)
    setPartialPayments(updatedPayments)
    saveToStorage("partialPayments", updatedPayments)
  }

  // Filtrar por mes seleccionado
  const filteredDebts = debts.filter((debt) => debt.dueDate.startsWith(selectedMonth))
  const filteredIncomes = incomes.filter((income) => income.expectedDate.startsWith(selectedMonth))

  // Calcular pagos parciales por deuda
  const getPartialPaymentsForDebt = (debtId: string) => {
    return partialPayments
      .filter((payment) => payment.debtId === debtId)
      .reduce((sum, payment) => sum + payment.amount, 0)
  }

  // Calcular estadísticas
  const totalReceivable = filteredDebts
    .filter((debt) => debt.type === "receivable" && debt.status === "pending")
    .reduce((sum, debt) => {
      const partialPaid = getPartialPaymentsForDebt(debt.id)
      return sum + (debt.amount - partialPaid)
    }, 0)

  const totalPayable = filteredDebts
    .filter((debt) => debt.type === "payable" && debt.status === "pending")
    .reduce((sum, debt) => {
      const partialPaid = getPartialPaymentsForDebt(debt.id)
      return sum + (debt.amount - partialPaid)
    }, 0)

  const totalExpectedIncome = filteredIncomes
    .filter((income) => income.status === "pending")
    .reduce((sum, income) => sum + income.amount, 0)

  const currentMonth = format(new Date(), "yyyy-MM")
  const nextMonth = format(addMonths(new Date(), 1), "yyyy-MM")

  // Filtrar deudas por tipo para mostrar cards
  const receivableDebts = filteredDebts.filter((debt) => debt.type === "receivable")
  const payableDebts = filteredDebts.filter((debt) => debt.type === "payable")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("debt.management.panel")}</h1>
          <p className="text-muted-foreground">{t("manage.debts.efficiently")}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="month-filter">{t("filter.by.month")}</Label>
            <Input
              id="month-filter"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40"
            />
          </div>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Resumen Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("receivable")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalReceivable.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredDebts.filter((d) => d.type === "receivable" && d.status === "pending").length}{" "}
              {t("pending.debts")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("payable")}</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalPayable.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredDebts.filter((d) => d.type === "payable" && d.status === "pending").length} {t("pending.debts")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("expected.income")}</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${totalExpectedIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredIncomes.filter((i) => i.status === "pending").length} {t("pending.income")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("projected.balance")}</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${(totalReceivable + totalExpectedIncome - totalPayable) >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              ${(totalReceivable + totalExpectedIncome - totalPayable).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {paymentPlans.filter((p) => p.status === "draft").length} {t("draft.plans")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="debts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="debts">{t("debts")}</TabsTrigger>
          <TabsTrigger value="incomes">{t("income")}</TabsTrigger>
          <TabsTrigger value="projections">{t("projections")}</TabsTrigger>
          <TabsTrigger value="reports">{t("reports")}</TabsTrigger>
        </TabsList>

        <TabsContent value="debts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t("debt.management")}</h2>
            <Dialog open={isAddDebtOpen} onOpenChange={setIsAddDebtOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("add.debt")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DebtForm
                  onSubmit={(data) => {
                    addDebt(data)
                    setIsAddDebtOpen(false)
                  }}
                  onCancel={() => setIsAddDebtOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Grid adaptativo que se expande según el contenido */}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${receivableDebts.length > 0 && payableDebts.length > 0 ? 2 : 1}, 1fr)`,
            }}
          >
            {receivableDebts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">{t("receivable.debts")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {receivableDebts.map((debt) => (
                    <DebtCard
                      key={debt.id}
                      debt={debt}
                      partialPayments={partialPayments.filter((p) => p.debtId === debt.id)}
                      onUpdate={updateDebt}
                      onDelete={deleteDebt}
                      onAddPartialPayment={addPartialPayment}
                      onDeletePartialPayment={deletePartialPayment}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            {payableDebts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">{t("payable.debts")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {payableDebts.map((debt) => (
                    <DebtCard
                      key={debt.id}
                      debt={debt}
                      partialPayments={partialPayments.filter((p) => p.debtId === debt.id)}
                      onUpdate={updateDebt}
                      onDelete={deleteDebt}
                      onAddPartialPayment={addPartialPayment}
                      onDeletePartialPayment={deletePartialPayment}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            {filteredDebts.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">{t("no.receivable.debts")}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="incomes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t("expected.income.management")}</h2>
            <Dialog open={isAddIncomeOpen} onOpenChange={setIsAddIncomeOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("add.income")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <IncomeForm
                  onSubmit={(data) => {
                    addIncome(data)
                    setIsAddIncomeOpen(false)
                  }}
                  onCancel={() => setIsAddIncomeOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIncomes.map((income) => (
              <IncomeCard key={income.id} income={income} onUpdate={updateIncome} onDelete={deleteIncome} />
            ))}
            {filteredIncomes.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">{t("no.income.registered")}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t("next.month.projections")}</h2>
            <Dialog open={isAddProjectionOpen} onOpenChange={setIsAddProjectionOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("new.projection")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <ProjectionForm
                  debts={debts}
                  incomes={incomes}
                  onSubmit={(data) => {
                    addProjection(data)
                    setIsAddProjectionOpen(false)
                  }}
                  onCancel={() => setIsAddProjectionOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projections.map((projection) => (
              <ProjectionCard
                key={projection.id}
                projection={projection}
                debts={debts}
                incomes={incomes}
                onUpdate={updateProjection}
                onDelete={deleteProjection}
              />
            ))}
            {projections.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">{t("no.projections.created")}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportsSection
            debts={debts}
            incomes={incomes}
            projections={paymentPlans}
            partialPayments={partialPayments}
            selectedMonth={selectedMonth}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
