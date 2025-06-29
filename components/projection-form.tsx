"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, addMonths } from "date-fns"
import { Plus, Minus } from "lucide-react"

interface ProjectionFormProps {
  debts: any[]
  incomes: any[]
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
}

export function ProjectionForm({ debts, incomes, onSubmit, onCancel, initialData }: ProjectionFormProps) {
  const nextMonth = format(addMonths(new Date(), 1), "yyyy-MM")

  const [formData, setFormData] = useState({
    name: "",
    month: nextMonth,
    debtsToReceive: [],
    debtsToPayy: [],
    notes: "",
    ...initialData,
  })

  const [customDebtToReceive, setCustomDebtToReceive] = useState({ description: "", amount: "" })
  const [customDebtToPay, setCustomDebtToPay] = useState({ description: "", amount: "" })

  const addCustomDebtToReceive = () => {
    if (customDebtToReceive.description && customDebtToReceive.amount) {
      const newDebt = {
        id: `custom-${Date.now()}`,
        description: customDebtToReceive.description,
        amount: Number.parseFloat(customDebtToReceive.amount),
      }
      setFormData({
        ...formData,
        debtsToReceive: [...formData.debtsToReceive, newDebt],
      })
      setCustomDebtToReceive({ description: "", amount: "" })
    }
  }

  const addCustomDebtToPay = () => {
    if (customDebtToPay.description && customDebtToPay.amount) {
      const newDebt = {
        id: `custom-${Date.now()}`,
        description: customDebtToPay.description,
        amount: Number.parseFloat(customDebtToPay.amount),
      }
      setFormData({
        ...formData,
        debtsToPayy: [...formData.debtsToPayy, newDebt],
      })
      setCustomDebtToPay({ description: "", amount: "" })
    }
  }

  const removeDebtToReceive = (id: string) => {
    setFormData({
      ...formData,
      debtsToReceive: formData.debtsToReceive.filter((debt: any) => debt.id !== id),
    })
  }

  const removeDebtToPay = (id: string) => {
    setFormData({
      ...formData,
      debtsToPayy: formData.debtsToPayy.filter((debt: any) => debt.id !== id),
    })
  }

  const addExistingDebt = (debt: any, type: "receive" | "pay") => {
    const debtData = {
      id: debt.id,
      description: debt.description,
      amount: debt.amount,
    }

    if (type === "receive") {
      if (!formData.debtsToReceive.find((d: any) => d.id === debt.id)) {
        setFormData({
          ...formData,
          debtsToReceive: [...formData.debtsToReceive, debtData],
        })
      }
    } else {
      if (!formData.debtsToPayy.find((d: any) => d.id === debt.id)) {
        setFormData({
          ...formData,
          debtsToPayy: [...formData.debtsToPayy, debtData],
        })
      }
    }
  }

  const totalToReceive = formData.debtsToReceive.reduce((sum: number, debt: any) => sum + debt.amount, 0)
  const totalToPay = formData.debtsToPayy.reduce((sum: number, debt: any) => sum + debt.amount, 0)
  const expectedBalance = totalToReceive - totalToPay

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      expectedBalance,
    })
  }

  // Filtrar deudas disponibles y manejar casos donde debts puede ser null/undefined
  const availableReceivableDebts = (debts || []).filter(
    (debt) =>
      debt &&
      debt.type === "receivable" &&
      debt.status === "pending" &&
      !formData.debtsToReceive.find((d: any) => d.id === debt.id),
  )

  const availablePayableDebts = (debts || []).filter(
    (debt) =>
      debt &&
      debt.type === "payable" &&
      debt.status === "pending" &&
      !formData.debtsToPayy.find((d: any) => d.id === debt.id),
  )

  return (
    <div className="max-h-[80vh] overflow-hidden flex flex-col">
      <DialogHeader className="flex-shrink-0">
        <DialogTitle>{initialData ? "Editar Proyección" : "Nueva Proyección del Próximo Mes"}</DialogTitle>
        <DialogDescription>
          Crea diferentes escenarios de lo que planeas cobrar y pagar el próximo mes
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="flex-1 px-1">
        <form onSubmit={handleSubmit} className="space-y-6 pr-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Proyección</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ej: Escenario Optimista, Plan Conservador"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">Mes</Label>
              <Input
                id="month"
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deudas a Cobrar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 text-base">Planificado a Cobrar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Deudas existentes disponibles */}
                {availableReceivableDebts.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Deudas Existentes</Label>
                    <div className="max-h-24 overflow-y-auto space-y-1">
                      {availableReceivableDebts.map((debt: any) => (
                        <div key={debt.id} className="flex items-center justify-between text-sm border rounded p-2">
                          <span className="text-xs">
                            {debt.description} - ${debt.amount.toLocaleString()}
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addExistingDebt(debt, "receive")}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agregar deuda personalizada */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Agregar Nueva</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Descripción"
                      value={customDebtToReceive.description}
                      onChange={(e) =>
                        setCustomDebtToReceive({
                          ...customDebtToReceive,
                          description: e.target.value,
                        })
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Monto"
                        value={customDebtToReceive.amount}
                        onChange={(e) =>
                          setCustomDebtToReceive({
                            ...customDebtToReceive,
                            amount: e.target.value,
                          })
                        }
                      />
                      <Button type="button" onClick={addCustomDebtToReceive}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lista de deudas seleccionadas */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Seleccionadas</Label>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {formData.debtsToReceive.map((debt: any) => (
                      <div key={debt.id} className="flex items-center justify-between text-sm bg-green-50 rounded p-2">
                        <span className="text-xs">{debt.description}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs">${debt.amount.toLocaleString()}</span>
                          <Button type="button" size="sm" variant="ghost" onClick={() => removeDebtToReceive(debt.id)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right font-bold text-green-600">Total: ${totalToReceive.toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>

            {/* Deudas a Pagar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 text-base">Planificado a Pagar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Deudas existentes disponibles */}
                {availablePayableDebts.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Deudas Existentes</Label>
                    <div className="max-h-24 overflow-y-auto space-y-1">
                      {availablePayableDebts.map((debt: any) => (
                        <div key={debt.id} className="flex items-center justify-between text-sm border rounded p-2">
                          <span className="text-xs">
                            {debt.description} - ${debt.amount.toLocaleString()}
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addExistingDebt(debt, "pay")}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agregar deuda personalizada */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Agregar Nueva</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Descripción"
                      value={customDebtToPay.description}
                      onChange={(e) =>
                        setCustomDebtToPay({
                          ...customDebtToPay,
                          description: e.target.value,
                        })
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Monto"
                        value={customDebtToPay.amount}
                        onChange={(e) =>
                          setCustomDebtToPay({
                            ...customDebtToPay,
                            amount: e.target.value,
                          })
                        }
                      />
                      <Button type="button" onClick={addCustomDebtToPay}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lista de deudas seleccionadas */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Seleccionadas</Label>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {formData.debtsToPayy.map((debt: any) => (
                      <div key={debt.id} className="flex items-center justify-between text-sm bg-red-50 rounded p-2">
                        <span className="text-xs">{debt.description}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs">${debt.amount.toLocaleString()}</span>
                          <Button type="button" size="sm" variant="ghost" onClick={() => removeDebtToPay(debt.id)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right font-bold text-red-600">Total: ${totalToPay.toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Balance Esperado */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Label className="text-lg font-medium">Balance Esperado</Label>
                <div className={`text-3xl font-bold mt-2 ${expectedBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${expectedBalance.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {expectedBalance >= 0 ? "Superávit proyectado" : "Déficit proyectado"}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas y Observaciones</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Estrategias, consideraciones especiales, etc."
              rows={3}
            />
          </div>
        </form>
      </ScrollArea>

      <DialogFooter className="flex-shrink-0 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          {initialData ? "Actualizar" : "Crear Proyección"}
        </Button>
      </DialogFooter>
    </div>
  )
}
