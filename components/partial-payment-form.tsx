"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { format } from "date-fns"

interface PartialPaymentFormProps {
  debt: any
  remainingAmount: number
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function PartialPaymentForm({ debt, remainingAmount, onSubmit, onCancel }: PartialPaymentFormProps) {
  const [formData, setFormData] = useState({
    amount: "",
    date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(formData.amount)

    if (amount <= 0 || amount > remainingAmount) {
      alert(`El monto debe ser mayor a 0 y no puede exceder $${remainingAmount.toLocaleString()}`)
      return
    }

    onSubmit({ ...formData, amount })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Registrar Pago Parcial</DialogTitle>
        <DialogDescription>
          {debt.description} - Restante: ${remainingAmount.toLocaleString()}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto del Pago</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              max={remainingAmount}
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder={`Máximo: $${remainingAmount.toLocaleString()}`}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Fecha del Pago</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notas (opcional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Método de pago, referencia, etc."
            rows={3}
          />
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>Después de este pago:</strong>
            <br />
            Restante: ${(remainingAmount - (Number.parseFloat(formData.amount) || 0)).toLocaleString()}
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Registrar Pago</Button>
        </DialogFooter>
      </form>
    </>
  )
}
