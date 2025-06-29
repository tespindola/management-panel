"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, addMonths, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChart } from "lucide-react"

export function ReportsSection({ debts, incomes, projections, partialPayments = [], selectedMonth }: any) {
  const currentDate = new Date()
  const previousMonth = format(subMonths(new Date(selectedMonth + "-01"), 1), "yyyy-MM")
  const nextMonth = format(addMonths(new Date(selectedMonth + "-01"), 1), "yyyy-MM")

  // Función para calcular pagos parciales por deuda
  const getPartialPaymentsForDebt = (debtId: string) => {
    return partialPayments
      .filter((payment: any) => payment.debtId === debtId)
      .reduce((sum: number, payment: any) => sum + payment.amount, 0)
  }

  // Función para obtener datos de un mes específico
  const getMonthData = (month: string) => {
    const monthDebts = debts.filter((d: any) => d.dueDate.startsWith(month))
    const monthIncomes = incomes.filter((i: any) => i.expectedDate.startsWith(month))
    const monthPartialPayments = partialPayments.filter((p: any) => p.date.startsWith(month))

    const receivableDebts = monthDebts.filter((d: any) => d.type === "receivable")
    const payableDebts = monthDebts.filter((d: any) => d.type === "payable")

    const totalReceivable = receivableDebts.reduce((sum: number, debt: any) => {
      const partialPaid = getPartialPaymentsForDebt(debt.id)
      return sum + (debt.status === "pending" ? debt.amount - partialPaid : 0)
    }, 0)

    const totalPayable = payableDebts.reduce((sum: number, debt: any) => {
      const partialPaid = getPartialPaymentsForDebt(debt.id)
      return sum + (debt.status === "pending" ? debt.amount - partialPaid : 0)
    }, 0)

    const totalIncomes = monthIncomes
      .filter((i: any) => i.status === "pending")
      .reduce((sum: number, income: any) => sum + income.amount, 0)

    const totalReceived = receivableDebts
      .filter((d: any) => d.status === "received")
      .reduce((sum: number, debt: any) => sum + debt.amount, 0)

    const totalPaid = payableDebts
      .filter((d: any) => d.status === "paid")
      .reduce((sum: number, debt: any) => sum + debt.amount, 0)

    const totalPartialPaymentsAmount = monthPartialPayments.reduce(
      (sum: number, payment: any) => sum + payment.amount,
      0,
    )

    return {
      debts: monthDebts,
      incomes: monthIncomes,
      receivableDebts,
      payableDebts,
      totalReceivable,
      totalPayable,
      totalIncomes,
      totalReceived,
      totalPaid,
      totalPartialPaymentsAmount,
      partialPayments: monthPartialPayments,
      balance: totalReceivable + totalIncomes - totalPayable,
      netFlow: totalReceived + totalIncomes - totalPaid - totalPartialPaymentsAmount,
    }
  }

  const currentMonthData = getMonthData(selectedMonth)
  const previousMonthData = getMonthData(previousMonth)
  const nextMonthData = getMonthData(nextMonth)

  // Datos de proyecciones
  const monthProjections = projections.filter((p: any) => p.month === nextMonth)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <PieChart className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Reportes y Análisis Detallado</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="comparison">Comparación</TabsTrigger>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="projections">Proyecciones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Mes Anterior", data: previousMonthData, month: previousMonth },
              { title: "Mes Actual", data: currentMonthData, month: selectedMonth, highlight: true },
              { title: "Próximo Mes", data: nextMonthData, month: nextMonth },
            ].map(({ title, data, month, highlight }) => (
              <Card key={month} className={highlight ? "ring-2 ring-blue-500" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(month + "-01"), "MMMM yyyy", { locale: es })}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span>Por Cobrar:</span>
                    </div>
                    <span className="font-bold text-green-600">${data.totalReceivable.toLocaleString()}</span>

                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-red-600" />
                      <span>Por Pagar:</span>
                    </div>
                    <span className="font-bold text-red-600">${data.totalPayable.toLocaleString()}</span>

                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-blue-600" />
                      <span>Ingresos:</span>
                    </div>
                    <span className="font-bold text-blue-600">${data.totalIncomes.toLocaleString()}</span>
                  </div>

                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Balance:</span>
                      <span className={`font-bold ${data.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                        ${data.balance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Deudas: {data.debts.length}</span>
                      <span>Ingresos: {data.incomes.length}</span>
                    </div>
                    {data.partialPayments.length > 0 && (
                      <div className="flex justify-between">
                        <span>Pagos parciales: {data.partialPayments.length}</span>
                        <span>${data.totalPartialPaymentsAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparación Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-600">Deudas por Cobrar</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Anterior</p>
                        <p className="font-bold">${previousMonthData.totalReceivable.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Actual</p>
                        <p className="font-bold">${currentMonthData.totalReceivable.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Próximo</p>
                        <p className="font-bold">${nextMonthData.totalReceivable.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600">Deudas por Pagar</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Anterior</p>
                        <p className="font-bold">${previousMonthData.totalPayable.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Actual</p>
                        <p className="font-bold">${currentMonthData.totalPayable.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Próximo</p>
                        <p className="font-bold">${nextMonthData.totalPayable.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-600">Ingresos Esperados</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Anterior</p>
                        <p className="font-bold">${previousMonthData.totalIncomes.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Actual</p>
                        <p className="font-bold">${currentMonthData.totalIncomes.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Próximo</p>
                        <p className="font-bold">${nextMonthData.totalIncomes.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendencias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Variación vs Mes Anterior</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Por Cobrar:</span>
                        <Badge
                          variant={
                            currentMonthData.totalReceivable >= previousMonthData.totalReceivable
                              ? "default"
                              : "secondary"
                          }
                        >
                          {currentMonthData.totalReceivable >= previousMonthData.totalReceivable ? "+" : ""}$
                          {(currentMonthData.totalReceivable - previousMonthData.totalReceivable).toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Por Pagar:</span>
                        <Badge
                          variant={
                            currentMonthData.totalPayable <= previousMonthData.totalPayable ? "default" : "destructive"
                          }
                        >
                          {currentMonthData.totalPayable >= previousMonthData.totalPayable ? "+" : ""}$
                          {(currentMonthData.totalPayable - previousMonthData.totalPayable).toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Ingresos:</span>
                        <Badge
                          variant={
                            currentMonthData.totalIncomes >= previousMonthData.totalIncomes ? "default" : "secondary"
                          }
                        >
                          {currentMonthData.totalIncomes >= previousMonthData.totalIncomes ? "+" : ""}$
                          {(currentMonthData.totalIncomes - previousMonthData.totalIncomes).toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Balance Proyectado</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Mes Actual:</span>
                        <span
                          className={`font-bold ${currentMonthData.balance >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          ${currentMonthData.balance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Próximo Mes:</span>
                        <span className={`font-bold ${nextMonthData.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ${nextMonthData.balance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Deudas por Cobrar - Detalle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentMonthData.receivableDebts.length > 0 ? (
                    currentMonthData.receivableDebts.map((debt: any) => {
                      const partialPaid = getPartialPaymentsForDebt(debt.id)
                      const remaining = debt.amount - partialPaid
                      return (
                        <div key={debt.id} className="border rounded p-3 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{debt.description}</h5>
                              <p className="text-sm text-muted-foreground">{debt.category}</p>
                            </div>
                            <Badge
                              className={
                                debt.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {debt.status === "pending" ? "Pendiente" : "Cobrado"}
                            </Badge>
                          </div>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Monto original:</span>
                              <span className="font-medium">${debt.amount.toLocaleString()}</span>
                            </div>
                            {partialPaid > 0 && (
                              <>
                                <div className="flex justify-between">
                                  <span>Cobrado parcial:</span>
                                  <span className="text-blue-600">-${partialPaid.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                  <span>Restante:</span>
                                  <span>${remaining.toLocaleString()}</span>
                                </div>
                              </>
                            )}
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Vence:</span>
                              <span>{format(new Date(debt.dueDate), "dd/MM/yyyy", { locale: es })}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No hay deudas por cobrar este mes</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Deudas por Pagar - Detalle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentMonthData.payableDebts.length > 0 ? (
                    currentMonthData.payableDebts.map((debt: any) => {
                      const partialPaid = getPartialPaymentsForDebt(debt.id)
                      const remaining = debt.amount - partialPaid
                      return (
                        <div key={debt.id} className="border rounded p-3 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{debt.description}</h5>
                              <p className="text-sm text-muted-foreground">{debt.category}</p>
                            </div>
                            <Badge
                              className={
                                debt.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {debt.status === "pending" ? "Pendiente" : "Pagado"}
                            </Badge>
                          </div>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Monto original:</span>
                              <span className="font-medium">${debt.amount.toLocaleString()}</span>
                            </div>
                            {partialPaid > 0 && (
                              <>
                                <div className="flex justify-between">
                                  <span>Pagado parcial:</span>
                                  <span className="text-blue-600">-${partialPaid.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                  <span>Restante:</span>
                                  <span>${remaining.toLocaleString()}</span>
                                </div>
                              </>
                            )}
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Vence:</span>
                              <span>{format(new Date(debt.dueDate), "dd/MM/yyyy", { locale: es })}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No hay deudas por pagar este mes</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen de Pagos Parciales */}
          {currentMonthData.partialPayments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pagos Parciales del Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentMonthData.partialPayments.map((payment: any) => {
                    const debt = debts.find((d: any) => d.id === payment.debtId)
                    return (
                      <div key={payment.id} className="flex justify-between items-center border rounded p-2">
                        <div>
                          <span className="font-medium">{debt?.description || "Deuda eliminada"}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {format(new Date(payment.date), "dd/MM/yyyy", { locale: es })}
                          </span>
                        </div>
                        <span className="font-bold">${payment.amount.toLocaleString()}</span>
                      </div>
                    )
                  })}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total Pagos Parciales:</span>
                    <span>${currentMonthData.totalPartialPaymentsAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Proyecciones para {format(new Date(nextMonth + "-01"), "MMMM yyyy", { locale: es })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {monthProjections.length > 0 ? (
                <div className="space-y-4">
                  {monthProjections.map((projection: any) => (
                    <div key={projection.id} className="border rounded p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{projection.name}</h4>
                        <Badge
                          className={
                            projection.expectedBalance >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }
                        >
                          {projection.expectedBalance >= 0 ? "Superávit" : "Déficit"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-muted-foreground">A Cobrar</p>
                          <p className="font-bold text-green-600">
                            $
                            {projection.debtsToReceive
                              ?.reduce((sum: number, debt: any) => sum + debt.amount, 0)
                              .toLocaleString() || "0"}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">A Pagar</p>
                          <p className="font-bold text-red-600">
                            $
                            {projection.debtsToPayy
                              ?.reduce((sum: number, debt: any) => sum + debt.amount, 0)
                              .toLocaleString() || "0"}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Balance</p>
                          <p
                            className={`font-bold ${projection.expectedBalance >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            ${projection.expectedBalance?.toLocaleString() || "0"}
                          </p>
                        </div>
                      </div>
                      {projection.notes && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Notas:</strong> {projection.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No hay proyecciones creadas para el próximo mes
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
